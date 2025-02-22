import { File, Folder } from 'lucide-react'
import { FileTypes, FileIconColors } from '~/lib/constants/fileTypes'

export const getItemIcon = (type: string) => {
  const lowerType = type.toLowerCase()

  if (lowerType === FileTypes.FOLDER) {
    return <Folder className={`h-6 w-6 ${FileIconColors[FileTypes.FOLDER]}`} />
  } else if (lowerType.includes('document')) {
    return <File className={`h-6 w-6 ${FileIconColors[FileTypes.DOCX]}`} />
  } else if (lowerType.includes('spreadsheet')) {
    return <File className={`h-6 w-6 ${FileIconColors[FileTypes.DOCX]}`} />
  } else if (lowerType.includes('image')) {
    return <File className={`h-6 w-6 ${FileIconColors[FileTypes.IMAGE]}`} />
  } else if (lowerType.includes('audio')) {
    return <File className={`h-6 w-6 ${FileIconColors[FileTypes.AUDIO]}`} />
  } else if (lowerType.includes('video')) {
    return <File className={`h-6 w-6 ${FileIconColors[FileTypes.VIDEO]}`} />
  } else if (lowerType.includes('pdf')) {
    return <File className={`h-6 w-6 ${FileIconColors[FileTypes.PDF]}`} />
  } else {
    return <File className={`h-6 w-6 ${FileIconColors.DEFAULT}`} />
  }
}
