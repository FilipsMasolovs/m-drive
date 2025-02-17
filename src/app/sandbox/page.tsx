import { auth } from '@clerk/nextjs/server'
import { db } from '~/server/db'
import { files_table, folders_table } from '~/server/db/schema'

export default function SandboxPage() {
  return (
    <div>
      <form
        action={async () => {
          'use server'

          const user = await auth()

          if (!user.userId) {
            throw new Error('User not found')
          }

          const mockFolders = [
            {
              id: 1,
              ownerId: user.userId,
              name: 'root',
              type: 'folder',
              parent: null,
            },
            {
              id: 2,
              ownerId: user.userId,
              name: 'Documents',
              type: 'folder',
              parent: 1,
            },
            {
              id: 3,
              ownerId: user.userId,
              name: 'Images',
              type: 'folder',
              parent: 1,
            },
            {
              id: 4,
              ownerId: user.userId,
              name: 'Private',
              type: 'folder',
              parent: 3,
            },
          ]

          const mockFiles = [
            {
              id: 5,
              ownerId: user.userId,
              name: 'Report.docx',
              type: 'document',
              parent: 2,
              size: 2500000,
              url: '',
            },
            {
              id: 6,
              ownerId: user.userId,
              name: 'Spreadsheet.xlsx',
              type: 'spreadsheet',
              parent: 2,
              size: 1800000,
              url: '',
            },
            {
              id: 7,
              ownerId: user.userId,
              name: 'Vacation.jpg',
              type: 'image',
              parent: 3,
              size: 4200000,
              url: '',
            },
            {
              id: 8,
              ownerId: user.userId,
              name: 'Family.png',
              type: 'image',
              parent: 3,
              size: 3100000,
              url: '',
            },
            {
              id: 9,
              ownerId: user.userId,
              name: 'Music.mp3',
              type: 'audio',
              parent: 1,
              size: 8500000,
              url: '',
            },
            {
              id: 10,
              ownerId: user.userId,
              name: 'Video.mp4',
              type: 'video',
              parent: 1,
              size: 95000000,
              url: '',
            },
            {
              id: 11,
              ownerId: user.userId,
              name: 'Document.pdf',
              type: 'pdf',
              parent: 1,
              size: 1200000,
              url: '',
            },
          ]

          await db.insert(folders_table).values(mockFolders)
          await db.insert(files_table).values(mockFiles)
        }}
      >
        <button type="submit">SEED</button>
      </form>
    </div>
  )
}
