const SHADOW = {
  sm: 'shadow-hard-sm',
  md: 'shadow-hard',
  lg: 'shadow-hard-lg',
}

/**
 * The building block of the whole UI: flat fill, 3px ink border, hard offset
 * shadow. `as` lets it render as a button/section when needed.
 */
export default function Card({
  as: Tag = 'div',
  shadow = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`border-[3px] border-ink bg-white ${SHADOW[shadow]} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
