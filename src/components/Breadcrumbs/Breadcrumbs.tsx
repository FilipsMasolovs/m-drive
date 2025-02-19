import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { FolderItem } from '~/types/types'
import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

interface BreadcrumbsProps {
  breadcrumbs: FolderItem[]
  rootFolderId: number
}

export default function Breadcrumbs({ breadcrumbs, rootFolderId }: BreadcrumbsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.getBoundingClientRect().width
      const breadcrumbElements = containerRef.current.querySelectorAll(`.${styles.breadcrumbContainer}`)
      let totalWidth = 0
      breadcrumbElements.forEach((el) => {
        totalWidth += el.getBoundingClientRect().width + 8
      })
      const rootLink = containerRef.current.querySelector('a')
      if (rootLink) {
        totalWidth += rootLink.getBoundingClientRect().width
      }
      setCollapsed(totalWidth > containerWidth)
    }
  }, [breadcrumbs])

  const renderFullBreadcrumbs = () => (
    <>
      <Link href={`/m/${rootFolderId}`}>M‑DRIVE</Link>
      {breadcrumbs.map((item) => (
        <div key={item.id} className={styles.breadcrumbContainer}>
          <ChevronRight />
          <Link href={`/m/${item.id}`}>{item.name}</Link>
        </div>
      ))}
    </>
  )

  const renderCollapsedBreadcrumbs = () => (
    <>
      <Link href={`/m/${rootFolderId}`}>M‑DRIVE</Link>
      {breadcrumbs.length > 1 && (
        <div className={styles.breadcrumbContainer} style={{ position: 'relative' }}>
          <ChevronRight />
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              color: 'inherit',
            }}
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-label="Show full breadcrumb list"
          >
            ...
          </button>
          {dropdownOpen && (
            <div className={styles.breadcrumbDropdown}>
              {breadcrumbs.map((item) => (
                <div key={item.id} className={styles.dropdownItem}>
                  <Link href={`/m/${item.id}`}>{item.name}</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {breadcrumbs.length > 0 && (
        <div className={styles.breadcrumbContainer}>
          <ChevronRight />
          <Link href={`/m/${breadcrumbs[breadcrumbs.length - 1]!.id}`}>{breadcrumbs[breadcrumbs.length - 1]!.name}</Link>
        </div>
      )}
    </>
  )

  return (
    <div className={styles.breadcrumbsContainer} ref={containerRef} role="navigation" aria-label="Breadcrumb">
      {collapsed ? renderCollapsedBreadcrumbs() : renderFullBreadcrumbs()}
    </div>
  )
}
