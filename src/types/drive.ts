export interface DbFile {
  id: number
  ownerId: string
  name: string
  type: string
  parent: number
  size: number
  url: string
  createdAt: Date
}

export interface DbFolder {
  id: number
  ownerId: string
  name: string
  type: string
  parent: number | null
  createdAt: Date
}

export interface FileItem {
  id: number
  name: string
  type: string
  url: string
  parent: number
  size: number
}

export interface FolderItem {
  id: number
  name: string
  type: 'folder'
  parent: number | null
}

export type DriveItem = FileItem | FolderItem
