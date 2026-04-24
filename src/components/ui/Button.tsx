import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    fullWidth?: boolean
  }
>

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#F97316] text-white hover:bg-orange-500',
  secondary: 'bg-[#2A2A3E] border border-[#3F3F5A] text-[#E2E8F0] hover:bg-[#313145]',
  danger: 'bg-[#DC2626] text-white hover:bg-red-700',
  ghost: 'bg-transparent text-[#E2E8F0] hover:bg-[#313145]',
}

export const Button = ({ children, className = '', variant = 'secondary', fullWidth, ...props }: ButtonProps) => (
  <button
    {...props}
    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${fullWidth ? 'w-full' : ''} ${variantClasses[variant]} ${className}`}
  >
    {children}
  </button>
)
