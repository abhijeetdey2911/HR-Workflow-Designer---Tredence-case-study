import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export const Input = ({ label, className = '', id, ...props }: InputProps) => (
  <label className="flex w-full flex-col gap-1 text-sm text-[#E2E8F0]" htmlFor={id}>
    {label && <span className="text-xs text-[#94A3B8]">{label}</span>}
    <input
      id={id}
      className={`bg-[#1E1E2E] border border-[#3F3F5A] text-[#E2E8F0] rounded-md px-3 py-2 text-sm outline-none transition-colors focus:border-[#F97316] ${className}`}
      {...props}
    />
  </label>
)
