import type { Metadata } from 'next'
import { Syne, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SmoothLayout from '@/components/SmoothLayout'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ebgueny.dev'),
  title: 'Ebgueny PJ — Full-Stack Engineer',
  description: 'ERPs, POS and multi-tenant SaaS in production — Laravel · NestJS · Angular. Architecting the unseen.',
  openGraph: {
    title: 'Ebgueny PJ — Full-Stack Engineer',
    description: 'The frontend is the vehicle. The backend is the destination.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${syne.variable} ${spaceGrotesk.variable}`}
        style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          background: 'var(--bg)',
          color: 'var(--fg)',
        }}
      >
        <SmoothLayout>
          <Navigation />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
        </SmoothLayout>
      </body>
    </html>
  )
}
