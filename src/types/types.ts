export type DriveItem = FolderItem | FileItem

export type FileItem = {
  id: number
  name: string
  type: string
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
