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
  folders: FolderItem[]
  files: FileItem[]
  initialFolderId: number
}

export default function MDrive({ folders, files, initialFolderId }: MDriveProps) {
  const router = useRouter()
  const [currentFolderId, setCurrentFolderId] = useState<number>(initialFolderId)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    setCurrentFolderId(initialFolderId)
  }, [initialFolderId])

  const getFolderItems = (folderId: number): DriveItem[] => {
    const folderItems = folders.filter((f) => f.parent === folderId)
    const fileItems = files.filter((f) => f.parent === folderId)
    return [...folderItems, ...fileItems]
  }

  const currentFolderItems = useMemo(() => getFolderItems(currentFolderId), [currentFolderId, folders, files])

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

  const syntheticRoot: FolderItem = { id: 0, name: 'M-Drive', type: 'folder', parent: null }

  const breadcrumbs = useMemo(() => {
    const crumbs = computeBreadcrumbs(currentFolderId)
    return currentFolderId === 0 ? [syntheticRoot] : [syntheticRoot, ...crumbs]
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
