'use client'

import { useState } from "react";
import { deleteCommentAction, editCommentAction } from "@/lib/comment-action";
import { Button } from "./ui/button";
import { Pencil, Trash2, X, Check } from "lucide-react";

export default function CommentItem({ comment, snippetId, currentUserId }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const isOwner = currentUserId === comment.userId;

    if (isEditing) {
        return (
            <div className="flex flex-col gap-2 mt-2 w-full">
                <textarea 
                    className="border rounded p-2 text-sm w-full focus:outline-orange-400"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className="flex gap-2">
                    <Button size="sm" className="bg-green-500 hover:bg-green-600 h-7" 
                        onClick={async () => {
                            await editCommentAction(comment.id, snippetId, editedContent);
                            setIsEditing(false);
                        }}>
                        <Check className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7" onClick={() => setIsEditing(false)}>
                        <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative">
            <p className="text-gray-700 mt-1">{comment.content}</p>
            {isOwner && (
                <div className="flex gap-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-xs text-blue-500 flex items-center gap-1 hover:underline">
                        <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button 
                        onClick={async () => {
                            if(confirm("Are you sure? This will delete all replies too.")) {
                                await deleteCommentAction(comment.id, snippetId);
                            }
                        }} 
                        className="text-xs text-red-500 flex items-center gap-1 hover:underline">
                        <Trash2 className="w-3 h-3" /> Delete
                    </button>
                </div>
            )}
        </div>
    );
}