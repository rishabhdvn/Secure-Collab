import React from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserRound } from "lucide-react"
export const Client = ({ name }) => {
    return (
        <li className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white text-black">
                    <UserRound />
                </AvatarFallback>
            </Avatar>
            <span className="text-sm">{name}</span>
        </li>
    )
}
