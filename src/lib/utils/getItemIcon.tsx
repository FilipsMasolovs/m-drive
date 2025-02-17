import { Folder, File } from 'lucide-react'

export const getItemIcon = (type: string) => {
  const lowerType = type.toLowerCase()

  if (lowerType === 'folder') {
    return <Folder className="h-6 w-6 text-gray-400" />
  } else if (lowerType.includes('document')) {
    return <File className="h-6 w-6 text-blue-400" />
  } else if (lowerType.includes('spreadsheet')) {
    return <File className="h-6 w-6 text-green-400" />
  } else if (lowerType.includes('image')) {
    return <File className="h-6 w-6 text-yellow-400" />
  } else if (lowerType.includes('audio')) {
    return <File className="h-6 w-6 text-purple-400" />
  } else if (lowerType.includes('video')) {
    return <File className="h-6 w-6 text-red-400" />
  } else if (lowerType.includes('pdf')) {
    return <File className="h-6 w-6 text-orange-400" />
  } else {
    return <File className="h-6 w-6 text-gray-400" />
  }
}
