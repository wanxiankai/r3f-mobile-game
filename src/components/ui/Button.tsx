import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 160,
  padding: '14px 28px',
  borderRadius: 12,
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: '0.02em',
  transition: 'transform 0.08s ease, opacity 0.2s ease',
  touchAction: 'manipulation'
}

const variants: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: { background: 'var(--color-accent)', color: '#06222e' },
  ghost: { background: 'rgba(255,255,255,0.08)', color: 'var(--color-fg)' },
  danger: { background: 'var(--color-danger)', color: '#fff' }
}

export function Button({ variant = 'primary', style, ...rest }: ButtonProps) {
  return <button {...rest} style={{ ...baseStyle, ...variants[variant], ...style }} />
}
