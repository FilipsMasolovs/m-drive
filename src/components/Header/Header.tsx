import { UserButton, SignedIn } from '@clerk/nextjs'
import AppLogo from '../AppLogo/AppLogo'
import HeaderItemsContainer from '../HeaderItemsContainer/HeaderItemsContainer'
import styles from './Header.module.css'
import UsageIndicator from '../UsageIndicator/UsageIndicator'
import GlobalSearch from '../GlobalSearch/GlobalSearch'

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
