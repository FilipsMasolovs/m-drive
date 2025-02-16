import { Folder, File as FileIcon } from 'lucide-react'

import { type FileType } from '~/types/types'

export const getItemIcon = (type: 'folder' | FileType) => {
  switch (type) {
    case 'folder':
      return <Folder className="h-6 w-6 text-gray-400" />
    case 'document':
      return <FileIcon className="h-6 w-6 text-blue-400" />
    case 'spreadsheet':
      return <FileIcon className="h-6 w-6 text-green-400" />
    case 'image':
      return <FileIcon className="h-6 w-6 text-yellow-400" />
    case 'audio':
      return <FileIcon className="h-6 w-6 text-purple-400" />
    case 'video':
      return <FileIcon className="h-6 w-6 text-red-400" />
    case 'pdf':
      return <FileIcon className="h-6 w-6 text-orange-400" />
    default:
      return <FileIcon className="h-6 w-6 text-gray-400" />
  }
}
