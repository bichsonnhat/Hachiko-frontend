import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'

interface BadgeButtonProps {
    icon: React.ReactNode;
    text: string | number;
    className?: string;
}

const BadgeButton: React.FC<BadgeButtonProps> = ({ icon, text, className }) => {
    return (
        <ThemedView className={`flex-row h-12 items-center bg-white rounded-full px-4 py-2 shadow-md shadow-slate-600 ${className}`}>
            {icon}
            <ThemedText className={'text-black font-bold ml-2'}>{text}</ThemedText>
        </ThemedView>
    )
}

export default BadgeButton  