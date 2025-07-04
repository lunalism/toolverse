// components/ToggleOption.tsx

'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface ToggleOptionProps {
    id: string
    label: string
    checked: boolean
    onChange: (checked: boolean) => void
}

export function ToggleOption({ id, label, checked, onChange }: ToggleOptionProps) {
    return (
        <div onClick={() => onChange(!checked)} className="flex items-center gap-2 p-3 border rounded-md shadow-sm cursor-pointer select-none" >
            <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} onClick={(e) => e.stopPropagation()}/>
            <Label htmlFor={id}>{label}</Label>
        </div>
    )
}
