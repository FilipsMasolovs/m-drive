import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'
import type { FolderItem } from '~/types/types'
import Link from 'next/link'
import styles from './Breadcrumbs.module.css'

function useContainerWidth(ref: React.RefObject<HTMLElement>): number {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (!ref.current) return

    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.getBoundingClientRect().width)
      }
    }

    updateWidth()

    const resizeObserver = new ResizeObserver(() => updateWidth())

    resizeObserver.observe(ref.current)

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current)
      }
    }
  }, [ref])

  return width
}

interface BreadcrumbsProps {
  breadcrumbs: FolderItem[]
  rootFolderId: number
}

export default function Breadcrumbs({ breadcrumbs, rootFolderId }: BreadcrumbsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const containerWidth = useContainerWidth(containerRef)
  const [collapsed, setCollapsed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (containerRef.current && containerWidth) {
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
  }, [breadcrumbs, containerWidth])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [dropdownOpen])

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
          <button className={styles.dropdownToggle} onClick={() => setDropdownOpen((prev) => !prev)} aria-label="Show full breadcrumb list" aria-expanded={dropdownOpen}>
            ...
          </button>
          {dropdownOpen && (
            <div className={styles.breadcrumbDropdownoverlay} onClick={() => setDropdownOpen((prev) => !prev)}>
              <div className={styles.breadcrumbDropdown} role="menu">
                <Link href={`/m/${rootFolderId}`}>M‑DRIVE</Link>
                {breadcrumbs.map((item) => (
                  <div key={item.id} className={styles.dropdownItem} role="menuitem">
                    <ChevronDown />
                    <Link href={`/m/${item.id}`}>{item.name}</Link>
                  </div>
                ))}
              </div>
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
