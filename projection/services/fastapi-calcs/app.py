
from fastapi import FastAPI
from monte_carlo import router as monte_carlo_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request, Response, status
import time
from collections import defaultdict
from pydantic import BaseModel
from typing import List


app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:19006"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Simple in-memory rate limiter (token bucket)
RATE_LIMIT = 60  # requests per minute
_buckets = defaultdict(lambda: [RATE_LIMIT, time.time()])

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host
    bucket, last = _buckets[ip]
    now = time.time()
    # refill tokens
    elapsed = now - last
    refill = int(elapsed * RATE_LIMIT / 60)
    if refill > 0:
        bucket = min(RATE_LIMIT, bucket + refill)
        last = now
    if bucket <= 0:
        return Response("Rate limit exceeded. Try again later.", status_code=status.HTTP_429_TOO_MANY_REQUESTS)
    _buckets[ip] = [bucket - 1, last]
    return await call_next(request)
@app.get("/healthz")
def healthz():
    return {"ok": True}

# Add Monte Carlo router
app.include_router(monte_carlo_router)

class ProjectionInput(BaseModel):
    initialBalance: float
    annualContribution: float
    years: int
    annualReturn: float
    inflation: float

class ProjectionResult(BaseModel):
    nominalBalances: List[float]
    realBalances: List[float]

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running!"}

@app.post("/calculate", response_model=ProjectionResult)
def calculate_projection(input: ProjectionInput):
    nominal = [input.initialBalance]
    real = [input.initialBalance]
    for i in range(1, input.years + 1):
        prev = nominal[-1]
        next_nominal = prev * (1 + input.annualReturn) + input.annualContribution
        nominal.append(next_nominal)
        next_real = next_nominal / ((1 + input.inflation) ** i)
        real.append(next_real)
    return {"nominalBalances": nominal, "realBalances": real}
