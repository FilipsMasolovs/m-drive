'use client'

import type React from 'react'
import { useState } from 'react'

import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import GridItem from '~/components/GridItem/GridItem'
import ListItem from '~/components/ListItem/ListItem'

import { type FolderItem, type FileItem } from '~/types/types'

import styles from './page.module.css'

const mockFolders: FolderItem[] = [
  {
    id: 0,
    name: 'root',
    type: 'folder',
    parent: null,
  },
  {
    id: 1,
    name: 'Documents',
    type: 'folder',
    parent: 0,
  },
  {
    id: 2,
    name: 'Images',
    type: 'folder',
    parent: 0,
  },
  {
    id: 10,
    name: 'Private',
    type: 'folder',
    parent: 2,
  },
]

const mockFiles: FileItem[] = [
  {
    id: 3,
    name: 'Report.docx',
    type: 'document',
    parent: 1,
    size: 2500000,
    url: '',
  },
  {
    id: 4,
    name: 'Spreadsheet.xlsx',
    type: 'spreadsheet',
    parent: 1,
    size: 1800000,
    url: '',
  },
  {
    id: 5,
    name: 'Vacation.jpg',
    type: 'image',
    parent: 2,
    size: 4200000,
    url: '',
  },
  {
    id: 6,
    name: 'Family.png',
    type: 'image',
    parent: 2,
    size: 3100000,
    url: '',
  },
  {
    id: 7,
    name: 'Music.mp3',
    type: 'audio',
    parent: 0,
    size: 8500000,
    url: '',
  },
  {
    id: 8,
    name: 'Video.mp4',
    type: 'video',
    parent: 0,
    size: 95000000,
    url: '',
  },
  {
    id: 9,
    name: 'Document.pdf',
    type: 'pdf',
    parent: 0,
    size: 1200000,
    url: '',
  },
]

type DriveItem = FolderItem | FileItem

const getFolderItems = (folderId: number): DriveItem[] => {
  const folders = mockFolders.filter((f) => f.parent === folderId)
  const files = mockFiles.filter((f) => f.parent === folderId)
  return [...folders, ...files]
}

export default function MDrive() {
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
            <ListItem
              key={item.id}
              item={item}
              handleItemClick={() => {
                handleItemClick(item)
              }}
              handleDelete={() => handleDelete(item)}
            />
          ) : (
            <GridItem
              key={item.id}
              item={item}
              handleItemClick={() => {
                handleItemClick(item)
              }}
              handleDelete={() => handleDelete(item)}
            />
          ),
        )}
      </main>
      <footer className={styles.footerContainer}>M-Drive</footer>
    </div>
  )
}
