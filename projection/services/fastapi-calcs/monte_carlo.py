
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, model_validator, validator
from fastapi import APIRouter, HTTPException, status
import numpy as np
from functools import lru_cache

class MonteCarloInput(BaseModel):
    """
    Input for Monte Carlo 401(k) simulation.
    """
    current_age: int = Field(..., description="Current age of participant (years)", example=35, gt=0)
    retire_age: int = Field(..., description="Retirement age (years)", example=65, gt=0)
    current_balance: float = Field(..., description="Current 401(k) balance ($)", example=50000, ge=0)
    annual_contrib: float = Field(..., description="Annual employee contribution ($)", example=10000, ge=0)
    employer_match_rate: float = Field(0.0, description="Employer match rate (decimal, e.g. 0.5 for 50%)", example=0.5, ge=0)
    expected_return: float = Field(..., description="Expected mean annual return (nominal, decimal, e.g. 0.07)", example=0.07, gt=-0.9)
    return_volatility: float = Field(..., description="Annual return volatility (stdev, decimal, e.g. 0.15)", example=0.15, ge=0)
    inflation: float = Field(0.02, description="Annual inflation rate (decimal)", example=0.02, ge=0)
    salary_growth: float = Field(0.03, description="Annual salary/contribution growth (decimal)", example=0.03)
    n_paths: int = Field(10000, description="Number of Monte Carlo paths", example=10000, ge=100, le=200000)
    seed: Optional[int] = Field(42, description="Random seed for reproducibility", example=42)
    fees_annual: float = Field(0.0, description="Annual fee (expense ratio/advisory, decimal)", example=0.005, ge=0, le=0.05)
    glidepath: bool = Field(False, description="Reduce risk as age increases (glidepath)", example=False)
    rebalance_annually: bool = Field(True, description="Rebalance portfolio annually", example=True)
    target_goal: Optional[Dict[str, Any]] = Field(None, description="Optional retirement goal (see TargetGoal)")

    @model_validator(mode="after")
    def check_ages(self):
        if self.retire_age <= self.current_age:
            raise ValueError('retire_age must be greater than current_age')
        return self

    @validator('n_paths')
    def n_paths_range(cls, v):
        if not (100 <= v <= 200000):
            raise ValueError('n_paths must be between 100 and 200,000')
        return v

    @validator('return_volatility')
    def volatility_nonnegative(cls, v):
        if v < 0:
            raise ValueError('return_volatility must be non-negative')
        return v

    @validator('expected_return')
    def expected_return_min(cls, v):
        if v <= -0.9:
            raise ValueError('expected_return must be greater than -0.9')
        return v

    @validator('inflation')
    def inflation_nonnegative(cls, v):
        if v < 0:
            raise ValueError('inflation must be non-negative')
        return v

    @validator('fees_annual')
    def fees_range(cls, v):
        if not (0 <= v <= 0.05):
            raise ValueError('fees_annual must be between 0 and 0.05')
        return v

class TargetGoal(BaseModel):
    retirement_spend: Optional[float] = None
    horizon_years: Optional[int] = None

class MonteCarloResponse(BaseModel):
    # percentiles will be a time-series per percentile label (e.g. 'p5': [v0, v1, ...])
    percentiles: Dict[str, List[float]]
    final_balances_nominal: Dict[str, float]
    final_balances_real: Dict[str, float]
    success_probability: Optional[float] = None
    sample_path: List[Dict[str, float]]

router = APIRouter()

@router.post(
    "/monte-carlo",
    response_model=MonteCarloResponse,
    responses={
        422: {
            "description": "Validation error with friendly message.",
            "content": {
                "application/json": {
                    "example": {
                        "detail": [
                            {"loc": ["body", "current_age"], "msg": "current_age must be positive", "type": "value_error"}
                        ]
                    }
                }
            },
        },
        200: {
            "content": {
                "application/json": {
                    "examples": {
                        "typical": {
                            "summary": "Typical scenario",
                            "value": {
                                "percentiles": {"p5": 200000, "p10": 250000, "p25": 350000, "p50": 500000, "p75": 700000, "p90": 900000, "p95": 1100000},
                                "final_balances_nominal": {"mean": 520000, "std": 120000},
                                "final_balances_real": {"mean": 320000, "std": 80000},
                                "success_probability": 0.85,
                                "sample_path": [{"age": 35, "nominal": 50000, "real": 50000}, {"age": 65, "nominal": 500000, "real": 320000}]
                            }
                        },
                        "conservative": {
                            "summary": "Conservative scenario",
                            "value": {
                                "percentiles": {"p5": 100000, "p10": 120000, "p25": 180000, "p50": 250000, "p75": 350000, "p90": 450000, "p95": 600000},
                                "final_balances_nominal": {"mean": 260000, "std": 60000},
                                "final_balances_real": {"mean": 160000, "std": 40000},
                                "success_probability": 0.65,
                                "sample_path": [{"age": 35, "nominal": 50000, "real": 50000}, {"age": 65, "nominal": 250000, "real": 160000}]
                            }
                        },
                        "aggressive": {
                            "summary": "Aggressive scenario",
                            "value": {
                                "percentiles": {"p5": 300000, "p10": 350000, "p25": 500000, "p50": 800000, "p75": 1200000, "p90": 1600000, "p95": 2000000},
                                "final_balances_nominal": {"mean": 900000, "std": 300000},
                                "final_balances_real": {"mean": 600000, "std": 200000},
                                "success_probability": 0.95,
                                "sample_path": [{"age": 35, "nominal": 50000, "real": 50000}, {"age": 65, "nominal": 800000, "real": 600000}]
                            }
                        }
                    }
                }
            }
        }
    }
)

def run_monte_carlo(input: MonteCarloInput) -> MonteCarloResponse:
    return monte_carlo_sim(input)

def _as_float64(x):
    return np.asarray(x, dtype=np.float64)

@lru_cache(maxsize=32)
def discount_factors(years: int, inflation: float):
    """Return discount vector for real dollar conversion."""
    return (1 + inflation) ** np.arange(years + 1, dtype=np.float64)

@lru_cache(maxsize=32)
def glidepath_vectors(years: int, mu: float, sigma: float, glidepath: bool):
    if glidepath:
        mu_vec = np.linspace(mu, mu - 0.02, years, dtype=np.float64)
        sigma_vec = np.linspace(sigma, sigma * 0.7, years, dtype=np.float64)
    else:
        mu_vec = np.full(years, mu, dtype=np.float64)
        sigma_vec = np.full(years, sigma, dtype=np.float64)
    return mu_vec, sigma_vec

def monte_carlo_sim(input: MonteCarloInput):
    try:
        years = int(input.retire_age - input.current_age)
        n = int(input.n_paths)
        if n > 200000 or years > 70:
            raise HTTPException(status_code=400, detail="n_paths must be <= 200,000 and years <= 70")
        np.random.seed(input.seed)
        mu = float(input.expected_return)
        sigma = float(input.return_volatility)
        # Glidepath vectors
        mu_vec, sigma_vec = glidepath_vectors(years, mu, sigma, input.glidepath)
        # Generate lognormal returns (vectorized)
        Z = np.random.randn(n, years).astype(np.float64)
        r = np.exp((mu_vec - 0.5 * sigma_vec ** 2) + sigma_vec * Z) - 1  # shape (n, years)
        # Preallocate contributions (vectorized)
        contribs = np.empty((n, years), dtype=np.float64)
        base_contrib = float(input.annual_contrib)
        for t in range(years):
            contribs[:, t] = base_contrib * (1 + input.employer_match_rate)
            base_contrib *= (1 + input.salary_growth)
        # Preallocate balances
        balances = np.full((n, years + 1), float(input.current_balance), dtype=np.float64)
        for t in range(years):
            balances[:, t] += contribs[:, t]
            gross = balances[:, t] * (1 + r[:, t])
            net = gross * (1 - input.fees_annual)
            balances[:, t + 1] = net
        # Discount factors (vectorized, cached)
        inflation_factors = discount_factors(years, float(input.inflation))
        real_balances = balances / inflation_factors
        # Final stats
        final_nominal = balances[:, -1]
        final_real = real_balances[:, -1]
        # Build percentile time-series across each year for the real balances
        pct_keys = [5, 25, 50, 75, 95]
        percentiles = {
            f"p{p}": [float(np.percentile(real_balances[:, t], p)) for t in range(years + 1)]
            for p in pct_keys
        }
        final_balances_nominal = {"mean": float(np.mean(final_nominal)), "std": float(np.std(final_nominal))}
        final_balances_real = {"mean": float(np.mean(final_real)), "std": float(np.std(final_real))}
        # Success probability (if TargetGoal)
        success_probability = None
        if input.target_goal and input.target_goal.get("retirement_spend") and input.target_goal.get("horizon_years"):
            spend = input.target_goal["retirement_spend"]
            horizon = input.target_goal["horizon_years"]
            r_real = (1 + input.expected_return) / (1 + input.inflation) - 1
            pv = spend * (1 - (1 + r_real) ** (-horizon)) / r_real if r_real != 0 else spend * horizon
            success_probability = float(np.mean(final_real >= pv))
        # Sample path
        sample_path = [
            {"age": input.current_age + t, "nominal": float(balances[0, t]), "real": float(real_balances[0, t])}
            for t in range(years + 1)
        ]
        return MonteCarloResponse(
            percentiles=percentiles,
            final_balances_nominal=final_balances_nominal,
            final_balances_real=final_balances_real,
            success_probability=success_probability,
            sample_path=sample_path,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

# Micro-benchmark
if __name__ == "__main__":
    import time
    example = MonteCarloInput(
        current_age=30,
        retire_age=70,
        current_balance=100000,
        annual_contrib=15000,
        employer_match_rate=0.5,
        expected_return=0.07,
        return_volatility=0.15,
        inflation=0.02,
        salary_growth=0.03,
        n_paths=10000,
        seed=42,
        fees_annual=0.005,
        glidepath=True,
        rebalance_annually=True,
    )
    t0 = time.time()
    result = monte_carlo_sim(example)
    t1 = time.time()
    print(f"Simulated 10,000 paths x 40 years in {t1-t0:.3f} seconds.")
    # percentiles are returned as time-series (one value per year)
    median_series = result.percentiles.get('p50')
    if isinstance(median_series, list) and len(median_series) > 0:
        print(f"Median final real: {median_series[-1]:.0f}")
    else:
        print("Median final real: (no percentile series available)")
