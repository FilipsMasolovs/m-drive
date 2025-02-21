import React, { useState } from 'react'
import { handleRenameItem } from '~/lib/utils/handleRenameItem'
import { useDriveStore } from '~/store/driveStore'
import styles from './RenameModal.module.css'

interface RenameModalProps {
  currentName: string
  itemId: number
  onRenameSuccess: (newName: string) => void
}

export default function RenameModal({ currentName, itemId, onRenameSuccess }: RenameModalProps) {
  const [newName, setNewName] = useState(currentName)
  const [loading, setLoading] = useState(false)

  const { setRenameModal } = useDriveStore()

  const handleClose = () => {
    setRenameModal(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setLoading(true)
    try {
      await handleRenameItem(itemId, newName)
      onRenameSuccess(newName)
      handleClose()
    } catch (error) {
      console.error('Rename failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={handleClose} role="presentation">
      <div className={styles.modalWrapper} role="dialog" aria-modal="true" aria-label="Rename item" onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Rename</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={styles.modalInput} placeholder="Enter new name" autoFocus />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.okButton} disabled={loading || !newName.trim() || newName === currentName}>
              {loading ? 'Renaming...' : 'OK'}
            </button>
            <button type="button" className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
