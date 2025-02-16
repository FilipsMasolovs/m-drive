import { db } from '~/server/db'
import { files, folders } from '~/server/db/schema'

const mockFolders = [
  {
    id: "root",
    name: 'root',
    type: 'folder',
    parent: null,
  },
  {
    id: "1",
    name: 'Documents',
    type: 'folder',
    parent: "root",
  },
  {
    id: "2",
    name: 'Images',
    type: 'folder',
    parent: "root",
  },
  {
    id: "3",
    name: 'Private',
    type: 'folder',
    parent: "2",
  },
]

const mockFiles = [
  {
    id: "3",
    name: 'Report.docx',
    type: 'document',
    parent: "1",
    size: 2500000,
    url: '',
  },
  {
    id: "4",
    name: 'Spreadsheet.xlsx',
    type: 'spreadsheet',
    parent: "1",
    size: 1800000,
    url: '',
  },
  {
    id: "5",
    name: 'Vacation.jpg',
    type: 'image',
    parent: "2",
    size: 4200000,
    url: '',
  },
  {
    id: "6",
    name: 'Family.png',
    type: 'image',
    parent: "2",
    size: 3100000,
    url: '',
  },
  {
    id: "7",
    name: 'Music.mp3',
    type: 'audio',
    parent: "root",
    size: 8500000,
    url: '',
  },
  {
    id: "8",
    name: 'Video.mp4',
    type: 'video',
    parent: "root",
    size: 95000000,
    url: '',
  },
  {
    id: "9",
    name: 'Document.pdf',
    type: 'pdf',
    parent: "root",
    size: 1200000,
    url: '',
  },
]

export default function SandboxPage() {
  return (
    <div>
      <form
        action={async () => {
          'use server'

          await db.insert(folders).values(mockFolders.map((folder, index) => ({
            id: index + 1,
            parent: index !== 0 ? 1 : null,
            name: folder.name,
            type: 'folder'
          })))
          await db.insert(files).values(mockFiles.map((file, index) => ({
            id: index + 1,
            parent: file.parent === "root" ? 0 : parseInt(file.parent),
            name: file.name,
            type: file.type,
            size: file.size,
            url: ''
          })))
        }}
      >
        <button type="submit">SEED</button>
      </form>
    </div>
  )
}
