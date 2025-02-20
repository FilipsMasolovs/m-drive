import React, { useState } from 'react'

import { handleRenameItem } from '~/lib/utils/handleRenameItem'

import styles from './RenameModal.module.css'

export interface RenameModalProps {
  currentName: string
  itemId: number
  setIsModalOpen: (open: boolean) => void
  setRenameModal: React.Dispatch<React.SetStateAction<{ open: boolean; itemId: number; currentName: string } | null>>
  onRenameSuccess: (newName: string) => void
}

export default function RenameModal({ currentName, itemId, setIsModalOpen, setRenameModal, onRenameSuccess }: RenameModalProps) {
  const [newName, setNewName] = useState(currentName)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setLoading(true)
    try {
      await handleRenameItem(itemId, newName)
      onRenameSuccess(newName)
      setRenameModal((prev) => (prev ? { ...prev, open: false } : null))
    } catch (error) {
      console.error('Rename failed:', error)
    } finally {
      setLoading(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)} role="presentation">
      <div className={styles.modalWrapper} role="dialog" aria-modal="true" aria-label="Rename item" onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Rename</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={styles.modalInput} placeholder="Enter folder name" autoFocus />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.okButton} disabled={loading}>
              OK
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
