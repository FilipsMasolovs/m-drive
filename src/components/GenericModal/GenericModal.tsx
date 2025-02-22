import React, { useEffect } from 'react'

import styles from './GenericModal.module.css'

interface GenericModalProps {
  onClose: () => void
  ariaLabel?: string
  children: React.ReactNode
}

const GenericModal: React.FC<GenericModalProps> = ({ onClose, ariaLabel, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div className={styles.modalWrapper} role="dialog" aria-modal="true" aria-label={ariaLabel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>
  )
}

export default GenericModal
