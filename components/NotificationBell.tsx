// components/NotificationBell.tsx
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
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-2xl z-50 h-32 overflow-y-auto">
                    <div className="p-4 border-b font-bold text-gray-800 flex justify-between items-center">
                        <span>Notifications</span>
                        <span className="text-xs font-normal text-gray-400">{notifications.length} total</span>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-400 italic">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map(n => {
                            // Determine where the notification should lead
                            const href = n.type === "FOLLOW" 
                                ? `/profile/${n.actorId}` // Ensure actorId is passed from your action/DB
                                : `/snippet/${n.snippetId}#comments`;

                            return (
                                <Link
                                    key={n.id}
                                    href={href}
                                    onClick={() => {
                                        markAsReadAction(n.id);
                                        setIsOpen(false);
                                    }}
                                    className={`block p-4 text-sm border-b transition-colors ${!n.isRead ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-orange-500' : 'bg-transparent'}`} />
                                        <div className="flex flex-col gap-1">
                                            <p className="text-gray-800 leading-snug">
                                                <span className="font-bold text-orange-600">{n.actorName}</span> 
                                                {n.type === "FOLLOW" ? " started following you" : " commented on your snippet"}
                                            </p>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}