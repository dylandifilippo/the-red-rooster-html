type Props = {
  href: string
  variant?: 'solid' | 'outline'
  children: React.ReactNode
}

export function CtaButton({ href, variant = 'solid', children }: Props) {
  const base = 'inline-block px-7 py-3.5 font-sans text-xs uppercase tracking-[0.18em] transition-colors'
  const styles =
    variant === 'solid'
      ? 'bg-accent text-white hover:bg-[#a93a26]'
      : 'border border-accent text-ink hover:bg-accent hover:text-white'
  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  )
}
