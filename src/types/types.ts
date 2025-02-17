export type FileType = 'document' | 'spreadsheet' | 'image' | 'image/jpeg' | "image/png" | 'audio' | 'video' | 'pdf'

export type FileItem = {
  id: number
  name: string
  type: FileType
  url: string
  parent: number
  size: number
}

export type FolderItem = {
  id: number
  name: string
  type: 'folder'
  parent: number | null
}
