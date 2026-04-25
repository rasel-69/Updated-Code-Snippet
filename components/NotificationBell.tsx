'use client'

import { Bell } from "lucide-react";
import { useState } from "react";
import { markAsReadAction } from "@/lib/comment-action";
import Link from "next/link";

export default function NotificationBell({ notifications }: { notifications: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2">
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b font-bold text-sm">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No notifications</div>
                    ) : (
                        notifications.map(n => (
                            <Link
                                key={n.id}
                                href={`/snippet/${n.snippetId}#comments`}
                                onClick={() => {
                                    markAsReadAction(n.id);
                                    setIsOpen(false);
                                }}
                                className={`block p-3 text-sm border-b hover:bg-gray-50 ${!n.isRead ? 'bg-orange-50' : ''}`}
                            >
                                <strong>{n.actorName}</strong> commented on your snippet
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}