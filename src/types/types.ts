export type FileType = 'document' | 'spreadsheet' | 'image' | 'audio' | 'video' | 'pdf'

export type FileItem = {
  id: string
  name: string
  type: FileType
  url: string
  parent: string
  size: number
}

export type FolderItem = {
  id: string
  name: string
  type: 'folder'
  parent: string | null
}
