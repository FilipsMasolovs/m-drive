'use client'

import React, { useState } from 'react'

import Actions from '~/components/Actions/Actions'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import LoadingComponent from '~/components/LoadingComponent/LoadingComponent'
import DriveActions from '~/components/DriveActions/DriveActions'
import GlobalSearch from '~/components/GlobalSearch/GlobalSearch'
import ItemModal from '~/components/ItemModal/ItemModal'
import ListItem from '~/components/ListItem/ListItem'
import RenameModal from '~/components/RenameModal/RenameModal'

import { deleteFile, deleteFolder, renameItem } from '~/server/actions/actions'
import type { FolderItem, FileItem } from '~/types/types'

import styles from './MDrive.module.css'

export type DriveItem = FolderItem | FileItem

interface MDriveProps {
  files: FileItem[]
  folders: FolderItem[]
  parents: FolderItem[]
  currentFolderId: number
  rootFolderId: number
  capacityUsed: number
}

export default function MDrive({ files, folders, parents, currentFolderId, rootFolderId, capacityUsed }: MDriveProps) {
  const currentItems: DriveItem[] = [...folders, ...files]

  const [modal, setModal] = useState<{ open: boolean; type: 'image' | 'pdf' | 'video' | 'application' | 'text/plain' | 'audio' | 'docx' | null; url: string; name: string }>({
    open: false,
    type: null,
    url: '',
    name: '',
  })

  const [renameModal, setRenameModal] = useState<{
    open: boolean
    itemId: number
    currentName: string
  } | null>(null)

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
      } else if (file.type.includes('text/plain')) {
        setModal({ open: true, type: 'text/plain', url: file.url, name: file.name })
      } else if (file.type.includes('audio')) {
        setModal({ open: true, type: 'audio', url: file.url, name: file.name })
      } else if (file.type.includes('docx') || file.type.includes('officedocument')) {
        setModal({ open: true, type: 'docx', url: file.url, name: file.name })
      } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('application')) {
        setModal({ open: true, type: 'application', url: file.url, name: file.name })
      } else {
        console.log(`Opening file: ${file.name}`)
      }
    } else {
      console.log(`Folder ${item.name} clicked.`)
    }
  }

  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (item: DriveItem) => {
    setDeleting(true)
    if (item.type === 'folder') {
      await deleteFolder(item.id)

      setDeleting(false)
    } else {
      await deleteFile(item.id)

      setDeleting(false)
    }
  }

  const handleRenameClick = (item: FileItem | FolderItem) => {
    setRenameModal({ open: true, itemId: item.id, currentName: item.name })
  }

  const handleRename = async (itemId: number, newName: string) => {
    try {
      await renameItem(itemId, newName)
      setRenameModal((prev) => (prev ? { ...prev, open: false } : null))
    } catch (error) {
      console.error('Rename failed:', error)
    }
  }

  const maxCapacity = 134217728

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <div className={styles.headerLeftSide}>
          <a href={`/m/${rootFolderId}`}>
            <svg width="54" height="54" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1f2937" />
              <path d="M7 16L16 7L25 16L16 25L7 16Z" fill="#2C4F7C" stroke="#2C4F7C" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 7V25" stroke="#0A1622" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
          <GlobalSearch handleItemClick={handleItemClick} />
        </div>
        <Actions capacityUsed={capacityUsed} maxCapacity={maxCapacity} />
      </header>
      <main className={styles.listContainer}>
        <Breadcrumbs breadcrumbs={parents} rootFolderId={rootFolderId} />
        {currentItems.map((item, index) => (
          <ListItem
            key={`${item.id}+${index}`}
            item={item}
            handleItemClick={() => handleItemClick(item)}
            handleDelete={() => handleDelete(item)}
            handleRename={() => handleRenameClick(item)}
          />
        ))}
      </main>
      {capacityUsed + 5242880 <= maxCapacity ? <DriveActions currentFolderId={currentFolderId} /> : null}
      {modal.open && modal.type && <ItemModal type={modal.type} url={modal.url} name={modal.name} setIsModalOpen={(open) => setModal((prev) => ({ ...prev, open }))} />}
      {renameModal?.open && (
        <RenameModal
          currentName={renameModal.currentName}
          itemId={renameModal.itemId}
          setIsModalOpen={(open) => setRenameModal((prev) => (prev ? { ...prev, open } : null))}
          onRename={handleRename}
        />
      )}
      {deleting && <LoadingComponent />}
    </div>
  )
}
