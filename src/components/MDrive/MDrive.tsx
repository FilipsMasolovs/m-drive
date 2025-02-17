'use client'

import React, { useState } from 'react'

import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import DriveActions from '~/components/DriveActions/DriveActions'
import GridItem from '~/components/GridItem/GridItem'
import ItemModal from '~/components/ItemModal/ItemModal'
import ListItem from '~/components/ListItem/ListItem'

import { useLocalStorage } from '~/lib/utils/useLocalStorage'
import { deleteFile } from '~/server/actions/actions'
import type { FolderItem, FileItem } from '~/types/types'

import styles from './MDrive.module.css'

export type DriveItem = FolderItem | FileItem

interface MDriveProps {
  files: FileItem[]
  folders: FolderItem[]
  parents: FolderItem[]
  currentFolderId: number
  rootFolderId: number
}

export default function MDrive({ files, folders, parents, currentFolderId, rootFolderId }: MDriveProps) {
  const currentItems: DriveItem[] = [...folders, ...files]
  const [viewMode, setViewMode] = useLocalStorage<'list' | 'grid'>('viewMode', 'list')

  const [modal, setModal] = useState<{ open: boolean; type: 'image' | 'pdf' | 'video' | null; url: string; name: string }>({
    open: false,
    type: null,
    url: '',
    name: '',
  })

  const handleItemClick = (item: DriveItem) => {
    if (typeof item.type === 'string' && !item.type.includes('folder')) {
      const file = item as FileItem
      if (!file.url) {
        console.warn('No URL provided')
        return
      }
      if (file.type.includes('image')) {
        setModal({ open: true, type: 'image', url: file.url, name: file.name })
      } else if (file.type.includes('pdf')) {
        setModal({ open: true, type: 'pdf', url: file.url, name: file.name })
      } else if (file.type.includes('video')) {
        setModal({ open: true, type: 'video', url: file.url, name: file.name })
      } else {
        console.log(`Opening file: ${file.name}`)
      }
    } else {
      console.log(`Folder ${item.name} clicked.`)
    }
  }

  const handleDelete = async (item: DriveItem) => {
    if (item.type === 'folder') {
      console.log(item)
    } else {
      await deleteFile(item.id)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <Breadcrumbs breadcrumbs={parents} rootFolderId={rootFolderId} />
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
      <DriveActions currentFolderId={currentFolderId} />
      {modal.open && modal.type && <ItemModal type={modal.type} url={modal.url} name={modal.name} setIsModalOpen={(open) => setModal((prev) => ({ ...prev, open }))} />}
    </div>
  )
}
