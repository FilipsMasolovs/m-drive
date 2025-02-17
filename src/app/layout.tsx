import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { GeistSans } from 'geist/font/sans'

import { PostHogProvider } from './_providers/PostHogProvider'

import '~/styles/global.css'

export const metadata: Metadata = {
  title: 'M-DRIVE',
  description: 'Slightly less functional, but way better looking Google Drive clone.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <PostHogProvider>{children}</PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
