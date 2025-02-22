import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { UploadButton } from '~/components/UploadThing/uploadthing'
import styles from './FileFolderUploads.module.css'
import { handleCreateFolder } from '~/lib/utils/handleCreateFolder'
import useClickOutside from '~/lib/utils/useClickOutside'

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
      console.error('Folder creation error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  useClickOutside(
    formRef,
    () => {
      setFolderName('')
      setIsCreatingFolder(false)
      setError(null)
    },
    isCreatingFolder,
  )

  const currentValidationError = validateFolderName(folderName)
  const isFolderNameValid = !currentValidationError

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
          <button className={styles.createFolderButton} type="submit" disabled={isSubmitting || !isFolderNameValid} aria-label="Confirm folder creation">
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
