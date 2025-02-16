'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import GridItem from '~/components/GridItem/GridItem'
import ListItem from '~/components/ListItem/ListItem'

import type { FolderItem, FileItem } from '~/types/types'

import styles from './MDrive.module.css'

export type DriveItem = FolderItem | FileItem

interface MDriveProps {
  folders: FolderItem[] // full folder tree
  files: FileItem[] // all files (for all folders)
  initialFolderId: number
}

export default function MDrive({ folders, files, initialFolderId }: MDriveProps) {
  const router = useRouter()
  // Use the current folder ID as a single source of truth.
  const [currentFolderId, setCurrentFolderId] = useState<number>(initialFolderId)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Helper: Return all items whose parent equals folderId.
  const getFolderItems = (folderId: number): DriveItem[] => {
    const folderItems = folders.filter((f) => f.parent === folderId)
    const fileItems = files.filter((f) => f.parent === folderId)
    return [...folderItems, ...fileItems]
  }

  // Derive current folder's items.
  const currentFolderItems = useMemo(() => {
    return getFolderItems(currentFolderId)
  }, [currentFolderId, folders, files])

  // Compute breadcrumbs by climbing from current folder upward.
  // Return an empty array if current folder id is root.
  const computeBreadcrumbs = (folderId: number): FolderItem[] => {
    if (folderId === 0) return []
    const path: FolderItem[] = []
    let current = folders.find((f) => f.id === folderId)
    while (current && current.id !== 0) {
      path.unshift(current)
      if (current.parent === 0) break
      current = folders.find((f) => f.id === current!.parent)
    }
    return path
  }

  // Create a properly typed synthetic root folder.
  const rootFolder: FolderItem = {
    id: 0,
    name: 'M-Drive',
    type: 'folder',
    parent: null,
  }

  // Derive breadcrumbs and prepend the synthetic root.
  const breadcrumbs = useMemo(() => {
    const computed = computeBreadcrumbs(currentFolderId)
    return currentFolderId === 0 ? [rootFolder] : [rootFolder, ...computed]
  }, [currentFolderId, folders])

  useEffect(() => {
    router.push(`/m/${currentFolderId}`)
  }, [currentFolderId, router])

  const handleItemClick = (item: DriveItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id)
    } else {
      console.log(`Opening file: ${item.name}`)
    }
  }

  // When a breadcrumb is clicked, update the current folder using its id.
  const handleBreadcrumbClick = (folderId: number) => {
    setCurrentFolderId(folderId)
  }

  const handleDelete = (item: DriveItem) => {
    console.log(`Deleting ${item.type}: ${item.name}`)
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <Breadcrumbs breadcrumbs={breadcrumbs} handleBreadcrumbClick={handleBreadcrumbClick} />
        <Actions viewMode={viewMode} setViewMode={setViewMode} />
      </header>
      <main className={viewMode === 'list' ? styles.listContainer : styles.gridContainer}>
        {currentFolderItems.map((item) =>
          viewMode === 'list' ? (
            <ListItem key={item.id} item={item} handleItemClick={() => handleItemClick(item)} handleDelete={() => handleDelete(item)} />
          ) : (
            <GridItem key={item.id} item={item} handleItemClick={() => handleItemClick(item)} handleDelete={() => handleDelete(item)} />
          ),
        )}
      </main>
      <footer className={styles.footerContainer}>M-Drive</footer>
    </div>
  )
}
