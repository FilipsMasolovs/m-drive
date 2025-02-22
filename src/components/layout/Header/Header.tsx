import { UserButton, SignedIn } from '@clerk/nextjs'
import AppLogo from '~/components/common/AppLogo/AppLogo'
import HeaderItemsContainer from '~/components/layout/HeaderItemsContainer/HeaderItemsContainer'
import styles from './Header.module.css'
import UsageIndicator from '~/components/drive/UsageIndicator/UsageIndicator'
import GlobalSearch from '~/components/drive/GlobalSearch/GlobalSearch'

interface HeaderProps {
	redirectPath: string
	capacityUsed: number
	maxCapacity: number
}

export default function Header({ redirectPath, capacityUsed, maxCapacity }: HeaderProps) {
	return (
		<header className={styles.headerContainer}>
			<HeaderItemsContainer>
				<AppLogo redirectPath={redirectPath} />
				<SignedIn>
					<GlobalSearch />
				</SignedIn>
			</HeaderItemsContainer>
			<SignedIn>
				<HeaderItemsContainer>
					<UsageIndicator capacityUsed={capacityUsed} maxCapacity={maxCapacity} />
					<div className={styles.userButton}>
						<UserButton />
					</div>
				</HeaderItemsContainer>
			</SignedIn>
		</header>
	)
}
