'use client'

import React from 'react'
import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import GridItem from '~/components/GridItem/GridItem'
import ListItem from '~/components/ListItem/ListItem'

import type { FolderItem, FileItem } from '~/types/types'
import styles from './MDrive.module.css'
import { useLocalStorage } from '~/lib/utils/useLocalStorage'

export type DriveItem = FolderItem | FileItem

interface MDriveProps {
  files: FileItem[]
  folders: FolderItem[]
  parents: FolderItem[]
}

export default function MDrive({ files, folders, parents }: MDriveProps) {
  const currentItems: DriveItem[] = [...folders, ...files]
  const [viewMode, setViewMode] = useLocalStorage<'list' | 'grid'>('viewMode', 'list')

  const handleItemClick = (item: DriveItem) => {
    console.log(`Opening file: ${item.name}`)
  }

  const handleDelete = (item: DriveItem) => {
    console.log(`Deleting ${item.type}: ${item.name}`)
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <Breadcrumbs breadcrumbs={parents} />
        <Actions viewMode={viewMode} setViewMode={setViewMode} />
      </header>
      <main className={viewMode === 'list' ? styles.listContainer : styles.gridContainer}>
        {currentItems.map((item, index) =>
          viewMode === 'list' ? (
            <ListItem key={`${item.id}+${index}`} item={item} handleItemClick={() => handleItemClick(item)} handleDelete={() => handleDelete(item)} />
          ) : (
            <GridItem key={`${item.id}+${index}`} item={item} handleItemClick={() => handleItemClick(item)} handleDelete={() => handleDelete(item)} />
          ),
        )}
      </main>
      <footer className={styles.footerContainer}>M-DRIVE</footer>
    </div>
  )
}
