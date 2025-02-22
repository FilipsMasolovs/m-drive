import { FileTypes, type FileType } from '~/lib/constants/fileTypes'
import { type FileItem } from '~/types/drive'

export function getPreviewType(file: FileItem): FileType {
  const fileType = file.type.toLowerCase()

  if (fileType.includes('image')) {
    return FileTypes.IMAGE
  } else if (fileType.includes('pdf')) {
    return FileTypes.PDF
  } else if (fileType.includes('video')) {
    return FileTypes.VIDEO
  } else if (fileType.includes('text/plain')) {
    return FileTypes.TXT
  } else if (fileType.includes('audio')) {
    return FileTypes.AUDIO
  } else if (fileType.includes('docx') || fileType.includes('officedocument')) {
    return FileTypes.DOCX
  } else if (fileType.includes('application')) {
    return FileTypes.APPLICATION
  }

  return FileTypes.APPLICATION
}
