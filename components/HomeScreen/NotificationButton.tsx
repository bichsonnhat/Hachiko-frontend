import React from 'react'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Text, View } from 'react-native'

interface NotificationButtonProps {
    icon: React.ReactNode,
    count: number,
    className?: string
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ icon, count, className }) => {
    return (
        <ThemedView className={"relative"}>
            <ThemedView className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md shadow-slate-600 ${className}`}>
                {icon}
            </ThemedView>
            {count > 0 && (
                <View className={"absolute top-0 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center"}>
                    <Text className={"text-white text-xs font-semibold"}>{count}</Text>
                </View>
            )}
        </ThemedView>
    )
}

export default NotificationButton