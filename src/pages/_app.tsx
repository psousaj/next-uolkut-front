import { AuthProvider } from '@/context/AuthContext'
import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )

}

export default MyApp
