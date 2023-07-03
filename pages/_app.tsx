import type { AppProps } from 'next/app'
import 'styles/index.css'
import Analytics from 'components/Analytics'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
