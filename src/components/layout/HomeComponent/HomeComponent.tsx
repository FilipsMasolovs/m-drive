import styles from './HomeComponent.module.css'

interface HomeComponentProps {
	buttonComponent: React.ReactNode
}

export default function HomeComponent({ buttonComponent }: HomeComponentProps) {
	return (
		<div className={styles.pageContainer}>
			<h1 className={styles.title}>
				M-DRIVE
				<i aria-hidden="true">M-DRIVE</i>
				<i aria-hidden="true">M-DRIVE</i>
			</h1>
			{buttonComponent}
		</div>
	)
}
