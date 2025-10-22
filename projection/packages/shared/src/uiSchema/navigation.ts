import { NavigationDefinition } from './types';

export const PRIMARY_NAVIGATION: NavigationDefinition = {
  id: 'primary',
  brand: {
    title: 'Nestly',
    logo: '🪺',
    subtitle: 'Retirement Projection Suite',
    href: '/',
  },
  links: [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      placement: 'primary',
      visibility: 'all',
    },
    {
      id: 'calculator',
      label: 'Calculators',
      href: '/calculator',
      placement: 'primary',
      visibility: 'all',
    },
    {
      id: 'whatIf',
      label: 'What-If',
      href: '/what-if',
      placement: 'primary',
      visibility: 'all',
    },
    {
      id: 'upgrade',
      label: 'Upgrade',
      href: '/upgrade',
      placement: 'primary',
      visibility: 'all',
      metadata: {
        badge: 'Premium',
      },
    },
    {
      id: 'signIn',
      label: 'Sign In',
      href: '/auth',
      placement: 'cta',
      visibility: 'all',
      style: 'outlined',
    },
  ],
  metadata: {
    orientation: 'top',
    enableElevation: true,
  },
};
