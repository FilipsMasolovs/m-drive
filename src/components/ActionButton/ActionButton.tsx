interface ActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  isMobile: boolean
}

export const ActionButton = ({ onClick, icon, label, isMobile }: ActionButtonProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation()
      e.preventDefault()
      onClick()
    }}
    aria-label={label}
  >
    {isMobile ? icon : label}
  </button>
)
