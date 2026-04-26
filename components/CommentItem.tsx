'use client'

import { useState } from "react";
import { deleteCommentAction, editCommentAction } from "@/lib/comment-action";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Pencil, Trash2, X, Check, MessageSquare, Reply } from "lucide-react";
import CommentForm from "./CommentForm";

export default function CommentItem({ 
    comment, 
    snippetId, 
    currentUserId, 
    snippetOwnerId,
    isReply = false
}: {
    comment: any;
    snippetId: number;
    currentUserId?: string;
    snippetOwnerId: string;
    isReply?: boolean;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    
    const isAuthor = currentUserId === comment.userId;
    const isCommentFromSnippetOwner = comment.userId === snippetOwnerId;
    const isSnippetOwner = currentUserId === snippetOwnerId;

    const getInitials = (name: string) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    };

    if (isEditing) {
        return (
            <div className={`flex flex-col gap-3 mt-4 w-full bg-white p-4 rounded-xl border border-orange-200 shadow-sm ${isReply ? "ml-4" : ""}`}>
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                        {getInitials(comment.user?.name)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{comment.user?.name}</span>
                </div>
                <Textarea 
                    className="min-h-[100px] border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-lg resize-none"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100" 
                        onClick={() => setIsEditing(false)}
                    >
                        <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                    </Button>
                    <Button 
                        size="sm" 
                        className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm" 
                        onClick={async () => {
                            await editCommentAction(comment.id, snippetId, editedText);
                            setIsEditing(false);
                        }}>
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Save Changes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`group relative transition-all duration-200 ${isReply ? "ml-8 mt-4" : "mt-6"}`}>
            {/* Thread Line for replies */}
            {isReply && (
                <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100 group-hover:bg-orange-100 transition-colors" />
            )}

            <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                        isCommentFromSnippetOwner ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
                    }`}>
                        {getInitials(comment.user?.name)}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">
                            {comment.user?.name || "User"}
                        </span>
                        
                        {isCommentFromSnippetOwner && (
                            <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                Author
                            </span>
                        )}
                        
                        {isAuthor && !isCommentFromSnippetOwner && (
                            <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                                You
                            </span>
                        )}

                        <span className="text-[11px] text-gray-400 ml-auto">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <div className="bg-gray-50/50 rounded-2xl rounded-tl-none p-4 border border-gray-100 group-hover:border-orange-100 group-hover:bg-orange-50/20 transition-all duration-200">
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-4 mt-2 items-center min-h-[24px]">
                        {currentUserId && (
                            <CommentForm 
                                snippetId={snippetId} 
                                parentId={comment.id} 
                                placeholder={`Reply to ${comment.user?.name}...`} 
                            />
                        )}

                        {(isAuthor || isSnippetOwner) && (
                            <div className="flex gap-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                {isAuthor && (
                                    <button 
                                        onClick={() => setIsEditing(true)} 
                                        className="text-xs text-gray-500 flex items-center gap-1 hover:text-orange-500 font-medium transition-colors">
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                )}
                                <button 
                                    disabled={isDeleting}
                                    onClick={async () => {
                                        if(confirm("Delete this comment and all its replies?")) {
                                            setIsDeleting(true);
                                            await deleteCommentAction(comment.id, snippetId);
                                            setIsDeleting(false);
                                        }
                                    }} 
                                    className="text-xs text-gray-500 flex items-center gap-1 hover:text-red-500 font-medium transition-colors">
                                    <Trash2 className="w-3 h-3" /> {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="space-y-4">
                            {comment.replies.map((reply: any) => (
                                <CommentItem 
                                    key={reply.id} 
                                    comment={reply} 
                                    snippetId={snippetId} 
                                    currentUserId={currentUserId}
                                    snippetOwnerId={snippetOwnerId}
                                    isReply={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}