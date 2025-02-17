import styles from './DeletingOverlay.module.css'

export default function DeletingOverlay() {
  return (
    <div className={styles.deletingOverlay}>
      <div className={styles.spinner}>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  )
}
