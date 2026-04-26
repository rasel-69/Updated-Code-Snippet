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
            <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 focus:outline-none">
                <Bell className="w-6 h-6 text-gray-600 hover:text-orange-500 transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full min-w-4 h-4 flex items-center justify-center px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b font-bold text-gray-700">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400 italic">No updates yet</div>
                    ) : (
                        notifications.map(n => (
                            <Link
                                key={n.id}
                                href={n.type === "FOLLOW" ? `/profile/${n.actorId || ''}` : `/snippet/${n.snippetId}#comments`}
                                onClick={() => {
                                    markAsReadAction(n.id);
                                    setIsOpen(false);
                                }}
                                className={`block p-4 text-sm border-b transition-colors ${!n.isRead ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}`}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-800">
                                        <strong className="font-semibold">{n.actorName}</strong> 
                                        {n.type === "FOLLOW" ? " started following you" : " commented on your snippet"}
                                    </span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}