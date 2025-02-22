import styles from './HeaderItemsContainer.module.css'

interface HeaderItemsContainerProps {
	children: React.ReactNode
}

export default function HeaderItemsContainer({ children }: HeaderItemsContainerProps) {
	return <div className={styles.headerItemsContainer}>{children}</div>
}
