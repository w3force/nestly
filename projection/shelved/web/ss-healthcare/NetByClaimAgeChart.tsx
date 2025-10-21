"use client";

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import { ClaimAgeSweepPoint } from '@projection/shared';
import { HelpTooltip } from '../../../components/HelpTooltip';

const ReactECharts = dynamic(() => import('echarts-for-react'), {
  ssr: false,
}) as React.ComponentType<any>;

interface NetByClaimAgeChartProps {
  sweep: ClaimAgeSweepPoint[];
  selectedAge: number;
  loading?: boolean;
}

export function NetByClaimAgeChart({ sweep, selectedAge, loading = false }: NetByClaimAgeChartProps) {
  if (loading || !sweep || sweep.length === 0) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            {loading ? 'Computing...' : 'Enter your information to see net benefit by claim age'}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const point = params[0];
        return `
          <strong>Claim Age ${point.data[0]}</strong><br/>
          SS Monthly: ${formatCurrency(point.data[1])}<br/>
          Net Monthly: ${formatCurrency(point.data[2])}
        `;
      },
    },
    legend: {
      data: ['Social Security', 'Net Benefit (after Medicare)'],
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Claim Age',
      min: 62,
      max: 70,
      interval: 1,
      axisLabel: {
        formatter: '{value}',
      },
    },
    yAxis: {
      type: 'value',
      name: 'Monthly Benefit',
      axisLabel: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    series: [
      {
        name: 'Social Security',
        type: 'line',
        data: sweep.map((point) => [point.age, point.ssMonthly, point.netMonthly]),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#4ABDAC',
        },
        itemStyle: {
          color: '#4ABDAC',
        },
        markPoint: {
          data: [
            {
              coord: [selectedAge, sweep.find((p) => p.age === selectedAge)?.ssMonthly || 0],
              symbol: 'pin',
              symbolSize: 50,
              itemStyle: {
                color: '#FF6B6B',
              },
              label: {
                show: true,
                formatter: 'Selected',
                position: 'top',
              },
            },
          ],
        },
      },
      {
        name: 'Net Benefit (after Medicare)',
        type: 'line',
        data: sweep.map((point) => [point.age, point.netMonthly, point.netMonthly]),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#69B47A',
          type: 'dashed',
        },
        itemStyle: {
          color: '#69B47A',
        },
        markPoint: {
          data: [
            {
              coord: [selectedAge, sweep.find((p) => p.age === selectedAge)?.netMonthly || 0],
              symbol: 'pin',
              symbolSize: 50,
              itemStyle: {
                color: '#FF6B6B',
              },
              label: {
                show: true,
                formatter: 'Selected',
                position: 'top',
              },
            },
          ],
        },
      },
    ],
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          Net Benefit by Claim Age
          <HelpTooltip
            title="Claim Age Sweep"
            description="This chart shows how your Social Security benefit and net monthly income (after Medicare costs) change based on when you claim. The red pins mark your selected claim age."
          />
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <ReactECharts option={chartOptions} style={{ height: 400 }} />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
          Claiming at {selectedAge} gives you{' '}
          <strong>{formatCurrency(sweep.find((p) => p.age === selectedAge)?.netMonthly || 0)}/month</strong> net benefit
        </Typography>
      </CardContent>
    </Card>
  );
}
