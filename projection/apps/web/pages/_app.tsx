import type { AppProps } from 'next/app';

import '../styles/reset.css';
import '../app/globals.css';

export default function NestlyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
