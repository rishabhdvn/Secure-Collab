import { useTheme } from '@/contexts/ThemeContext'
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-slate-400"
            />
            <Moon className="h-4 w-4" />
        </div>
    )
} 