"use client";
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Calculate, CompareArrows, Person } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  
  const getActiveTab = () => {
    if (pathname === '/' || pathname === '/start') return 0;
    if (pathname?.startsWith('/calculator')) return 1;
    if (pathname?.startsWith('/what-if')) return 2;
    if (pathname?.startsWith('/profile')) return 3;
    return 0;
  };

  const [value, setValue] = React.useState(getActiveTab());

  React.useEffect(() => {
    setValue(getActiveTab());
  }, [pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const routes = ['/', '/calculator', '/what-if', '/profile'];
    router.push(routes[newValue]);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(48, 64, 58, 0.5)',
            '&.Mui-selected': {
              color: '#69B47A',
            },
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<Home />} />
        <BottomNavigationAction label="Calculator" icon={<Calculate />} />
        <BottomNavigationAction label="What-If" icon={<CompareArrows />} />
        <BottomNavigationAction label="Profile" icon={<Person />} />
      </BottomNavigation>
    </Paper>
  );
}
