'use client'

import { Checkbox } from '@/components/ui/checkbox'

interface ToggleOptionProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function ToggleOption({ id, label, checked, onChange }: ToggleOptionProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition
      ${checked ? 'bg-primary text-white' : 'bg-background text-foreground'}
      `}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(Boolean(v))}
        onClick={(e) => e.stopPropagation()} // 중복 토글 방지
      />
      <span className="text-sm select-none">{label}</span>
    </div>
  )
}
