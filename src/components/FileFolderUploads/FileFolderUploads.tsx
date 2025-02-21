import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { UploadButton } from '~/components/UploadThing/uploadthing'
import styles from './FileFolderUploads.module.css'
import { handleCreateFolder } from '~/lib/utils/handleCreateFolder'

const MAX_FOLDER_NAME_LENGTH = 255
const FOLDER_NAME_PATTERN = /^[^<>:"/\\|?*\x00-\x1F]*$/

interface FileFolderUploadsProps {
  currentFolderId: number
}

export default function FileFolderUploads({ currentFolderId }: FileFolderUploadsProps) {
  const router = useRouter()
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const validateFolderName = (name: string): string | null => {
    if (!name.trim()) return 'Folder name cannot be empty'
    if (name.length > MAX_FOLDER_NAME_LENGTH) return 'Folder name is too long, max 255'
    if (!FOLDER_NAME_PATTERN.test(name)) return 'Folder name contains invalid characters'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateFolderName(folderName)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await handleCreateFolder(folderName, currentFolderId)
      setFolderName('')
      setIsCreatingFolder(false)
      router.refresh()
    } catch (err) {
      setError('Failed to create folder. Please try again. More details in the console.')
      console.error('err: ', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setFolderName('')
      setIsCreatingFolder(false)
      setError(null)
    }
  }, [])

  useEffect(() => {
    if (!isCreatingFolder) return

    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [isCreatingFolder, handleOutsideClick])

  return (
    <div className={styles.fileAndFolderCreationContainer}>
      {isCreatingFolder ? (
        <form ref={formRef} onSubmit={handleSubmit} aria-label="Create new folder">
          <input
            className={styles.folderNameInput}
            type="text"
            placeholder="Folder name..."
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value)
              setError(null)
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'folder-name-error' : undefined}
            disabled={isSubmitting}
          />
          {error && (
            <div id="folder-name-error" className={styles.folderNameError} role="alert">
              {error}
            </div>
          )}
          <button className={styles.createFolderButton} type="submit" disabled={isSubmitting} aria-label="Confirm folder creation">
            {isSubmitting ? '...' : '+'}
          </button>
        </form>
      ) : (
        <button className={styles.openFormButton} onClick={() => setIsCreatingFolder(true)} aria-label="Create new folder">
          Create Folder
        </button>
      )}
      <UploadButton
        className={styles.uploadFileButton}
        endpoint="driveUploader"
        onClientUploadComplete={() => {
          router.refresh()
        }}
        input={{
          folderId: currentFolderId,
        }}
      />
    </div>
  )
}
