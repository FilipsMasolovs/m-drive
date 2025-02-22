import styles from './LoadingComponent.module.css'

export default function LoadingComponent({backgroundColor}:{backgroundColor: string}) {
	return (
		<div className={styles.loadingComponent} style={{ backgroundColor: backgroundColor }}>
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
