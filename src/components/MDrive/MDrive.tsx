'use client'

import type React from 'react'
import { useState } from 'react'

import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import GridItem from '~/components/GridItem/GridItem'
import ListItem from '~/components/ListItem/ListItem'

import { type FolderItem, type FileItem } from '~/types/types'

import styles from './MDrive.module.css'

export type DriveItem = FolderItem | FileItem

interface MDriveProps {
  folders: FolderItem[]
  files: FileItem[]
}

export default function MDrive({ folders, files }: MDriveProps) {
  const getFolderItems = (folderId: number): DriveItem[] => {
    const filteredFolders = folders.filter((f) => f.parent === folderId)
    const filteredFiles = files.filter((f) => f.parent === folderId)
    return [...filteredFolders, ...filteredFiles]
  }

  const [currentFolder, setCurrentFolder] = useState<DriveItem[]>(getFolderItems(0))
  const [breadcrumbs, setBreadcrumbs] = useState<FolderItem[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const handleItemClick = (item: DriveItem) => {
    if (item.type === 'folder') {
      if (item.id !== 0) {
        setBreadcrumbs([...breadcrumbs, item])
      }
      setCurrentFolder(getFolderItems(item.id))
    } else {
      console.log(`Opening file: ${item.name}`)
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      setCurrentFolder(getFolderItems(0))
      setBreadcrumbs([])
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index)
      setBreadcrumbs(newBreadcrumbs)
      const lastFolder = newBreadcrumbs[newBreadcrumbs.length - 1]
      if (lastFolder) {
        setCurrentFolder(getFolderItems(lastFolder.id))
      } else {
        setCurrentFolder(getFolderItems(0))
      }
    }
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
        {currentFolder.map((item) =>
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
