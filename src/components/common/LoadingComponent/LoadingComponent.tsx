import styles from './LoadingComponent.module.css'

export default function LoadingComponent() {
  return (
    <div className={styles.loadingComponent}>
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
