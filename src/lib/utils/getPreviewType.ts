import type { FileItem } from '~/types/types'

export function getPreviewType(file: FileItem): string {
  if (file.type.includes('image')) return 'image'
  if (file.type.includes('pdf')) return 'pdf'
  if (file.type.includes('video')) return 'video'
  if (file.type.includes('text/plain')) return 'text/plain'
  if (file.type.includes('audio')) return 'audio'
  if (file.type.includes('docx') || file.type.includes('officedocument')) return 'docx'
  if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('application')) return 'application'
  return file.type
}
