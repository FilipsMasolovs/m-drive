'use client'

import { UserButton } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react'

import AppLogo from '~/components/AppLogo/AppLogo'
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs'
import FileFolderUploads from '~/components/FileFolderUploads/FileFolderUploads'
import GlobalSearch from '~/components/GlobalSearch/GlobalSearch'
import HeaderItemsContainer from '~/components/HeaderItemsContainer/HeaderItemsContainer'
import ItemModal from '~/components/ItemModal/ItemModal'
import ListItem from '~/components/ListItem/ListItem'
import LoadingComponent from '~/components/LoadingComponent/LoadingComponent'
import RenameModal from '~/components/RenameModal/RenameModal'
import UsageIndicator from '~/components/UsageIndicator/UsageIndicator'

import ACTIONS from '~/server/actions/actions'
import type { FolderItem, FileItem } from '~/types/types'

import styles from './MDrive.module.css'
import { handleDeleteItem } from '~/lib/utils/handleDeleteItem'

export type DriveItem = FolderItem | FileItem

interface MDriveProps {
  files: FileItem[]
  folders: FolderItem[]
  parents: FolderItem[]
  currentFolderId: number
  rootFolderId: number
  capacityUsed: number
  maxCapacity: number
}

export default function MDrive({ files, folders, parents, currentFolderId, rootFolderId, capacityUsed, maxCapacity }: MDriveProps) {
  const currentItems: DriveItem[] = [...folders, ...files]

  const [preloadedFiles, setPreloadedFiles] = useState<Record<number, string>>({})

  const [deleting, setDeleting] = useState(false)

  const [modal, setModal] = useState<{
    open: boolean
    type: 'image' | 'pdf' | 'video' | 'application' | 'text/plain' | 'audio' | 'docx' | null
    url: string
    name: string
  }>({ open: false, type: null, url: '', name: '' })

  const [renameModal, setRenameModal] = useState<{
    open: boolean
    itemId: number
    currentName: string
  } | null>(null)

  useEffect(() => {
    async function preloadFiles() {
      const fileItems = files.filter((file) => file.url !== '')
      const preloaded: Record<number, string> = {}
      await Promise.all(
        fileItems.map(async (file) => {
          try {
            const res = await fetch(file.url)
            if (res.ok) {
              const blob = await res.blob()
              const blobUrl = URL.createObjectURL(blob)
              preloaded[file.id] = blobUrl
            } else {
              console.warn(`Failed to preload file ${file.name}`)
            }
          } catch (error) {
            console.error('Error preloading file', file.name, error)
          }
        }),
      )
      setPreloadedFiles(preloaded)
    }
    preloadFiles()
  }, [files])

  useEffect(() => {
    return () => {
      Object.values(preloadedFiles).forEach((blobUrl) => URL.revokeObjectURL(blobUrl))
    }
  }, [preloadedFiles])

  const handleItemClick = (item: DriveItem) => {
    if (typeof item.type === 'string' && !item.type.includes('folder')) {
      const file = item as FileItem
      if (!file.url) {
        console.warn('No URL provided')
        return
      }

      const previewUrl = preloadedFiles[file.id] || file.url

      if (file.type.includes('image')) {
        setModal({ open: true, type: 'image', url: previewUrl, name: file.name })
      } else if (file.type.includes('pdf')) {
        setModal({ open: true, type: 'pdf', url: previewUrl, name: file.name })
      } else if (file.type.includes('video')) {
        setModal({ open: true, type: 'video', url: previewUrl, name: file.name })
      } else if (file.type.includes('text/plain')) {
        setModal({ open: true, type: 'text/plain', url: previewUrl, name: file.name })
      } else if (file.type.includes('audio')) {
        setModal({ open: true, type: 'audio', url: previewUrl, name: file.name })
      } else if (file.type.includes('docx') || file.type.includes('officedocument')) {
        setModal({ open: true, type: 'docx', url: previewUrl, name: file.name })
      } else if (file.type.includes('zip') || file.type.includes('rar') || file.type.includes('application')) {
        setModal({ open: true, type: 'application', url: previewUrl, name: file.name })
      } else {
        console.log(`Opening file: ${file.name}`)
      }
    } else {
      console.log(`Folder ${item.name} clicked.`)
    }
  }

  const handleRenameClick = (item: FileItem | FolderItem) => {
    setRenameModal({ open: true, itemId: item.id, currentName: item.name })
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <HeaderItemsContainer>
          <AppLogo redirectPath={`/m/${rootFolderId}`} />
          <GlobalSearch handleItemClick={handleItemClick} />
        </HeaderItemsContainer>
        <HeaderItemsContainer>
          <UsageIndicator capacityUsed={capacityUsed} maxCapacity={maxCapacity} />
          <UserButton />
        </HeaderItemsContainer>
      </header>
      <main className={styles.listContainer}>
        <Breadcrumbs breadcrumbs={parents} rootFolderId={rootFolderId} />
        {currentItems.map((item, index) => (
          <ListItem
            key={`${item.id}-${index}`}
            item={item}
            handleItemClick={() => handleItemClick(item)}
            handleDelete={async () => {
              setDeleting(true)
              await handleDeleteItem(item)
              setDeleting(false)
            }}
            handleRename={() => handleRenameClick(item)}
          />
        ))}
      </main>
      {capacityUsed <= maxCapacity && <FileFolderUploads currentFolderId={currentFolderId} />}
      {modal.open && modal.type && <ItemModal type={modal.type} url={modal.url} name={modal.name} setIsModalOpen={(open) => setModal((prev) => ({ ...prev, open }))} />}
      {renameModal?.open && (
        <RenameModal
          currentName={renameModal.currentName}
          itemId={renameModal.itemId}
          setIsModalOpen={(open) => setRenameModal((prev) => (prev ? { ...prev, open } : null))}
          setRenameModal={setRenameModal}
        />
      )}
      {deleting && <LoadingComponent />}
    </div>
  )
}
