import Navbar from '@/components/Navbar'
import './globals.css'
import { Raleway } from 'next/font/google'

const raleway = Raleway({ subsets: ['latin'] })

export const metadata = {
  title: 'Afterwise',
  description: 'Trustless end of life digital legacy management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={raleway.className}>
        <Navbar />
        {children}</body>
    </html>
  )
}
