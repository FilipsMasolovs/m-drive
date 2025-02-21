import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { GeistSans } from 'geist/font/sans'
import { type Metadata } from 'next'

import { PostHogProvider } from '~/app/_providers/PostHogProvider'
import Header from '~/components/Header/Header'
import { QUERIES } from '~/server/db/queries'

import '~/styles/global.css'

export const metadata: Metadata = {
  title: 'M-DRIVE',
  description: 'Slightly less functional, but way better looking Google Drive clone.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  let allFiles = null
  let capacityUsed = 0
  let redirectUrl = ''

  if (session.userId) {
    allFiles = await QUERIES.getAllFiles(session.userId)
    capacityUsed = allFiles.reduce((acc, file) => acc + file.size, 0)

    const rootFolder = await QUERIES.getRootFolderForUser(session.userId)
    if (!rootFolder) {
      redirectUrl = '/'
    } else {
      redirectUrl = `/m/${rootFolder.id}`
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <PostHogProvider>
            <Header redirectPath={session.userId ? redirectUrl : '/'} capacityUsed={capacityUsed} maxCapacity={134217728} />
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
