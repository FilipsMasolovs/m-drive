'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import GridItem from '~/components/GridItem/GridItem'
import ImageModal from '~/components/ImageModal/ImageModal'
import ListItem from '~/components/ListItem/ListItem'
import { UploadButton } from '~/components/UploadThing/uploadthing'

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
}

export default function MDrive({ files, folders, parents, currentFolderId }: MDriveProps) {
  const currentItems: DriveItem[] = [...folders, ...files]
  const [viewMode, setViewMode] = useLocalStorage<'list' | 'grid'>('viewMode', 'list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState('')
  const [modalImageName, setModalImageName] = useState('')

  const router = useRouter()

  const handleItemClick = (item: DriveItem) => {
    if (typeof item.type === 'string' && item.type.startsWith('image')) {
      if ((item as FileItem).url) {
        setModalImageUrl((item as FileItem).url)
        setModalImageName((item as FileItem).name)
        setIsModalOpen(true)
      } else {
        console.warn('No image URL provided')
      }
    } else {
      console.log(`Opening file: ${item.name}`)
    }
  }

  const handleDelete = async (item: DriveItem) => {
    if (item.type === "folder") {
      console.log(item)
    } else {
      await deleteFile(item.id)
    }
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
      <div className={styles.fileUploadButton}>
        <UploadButton
          endpoint="driveUploader"
          onClientUploadComplete={() => {
            router.refresh()
          }}
          input={{
            folderId: currentFolderId,
          }}
        />
      </div>
      {isModalOpen && <ImageModal url={modalImageUrl} name={modalImageName} setIsModalOpen={setIsModalOpen} />}
    </div>
  )
}
