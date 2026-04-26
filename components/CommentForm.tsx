'use client'

import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { addCommentAction } from "@/lib/comment-action";
import { SendHorizontal } from "lucide-react";

export default function CommentForm({ 
    snippetId, 
    parentId, 
    placeholder = "Share your thoughts..." 
}: { 
    snippetId: number, 
    parentId?: number, 
    placeholder?: string 
}) {
    const [isReplying, setIsReplying] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await addCommentAction(formData);
            formRef.current?.reset();
            setIsReplying(false);
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={`mt-4 ${parentId ? "ml-2" : ""}`}>
            {!parentId || isReplying ? (
                <form 
                    ref={formRef}
                    action={handleSubmit}
                    className="flex flex-col gap-3 group"
                >
                    <input type="hidden" name="snippetId" value={snippetId} />
                    {parentId && <input type="hidden" name="parentId" value={parentId} />}
                    
                    <div className="relative">
                        <Textarea 
                            name="text"
                            placeholder={placeholder}
                            className="min-h-[100px] w-full resize-none border-gray-200 bg-white p-4 text-sm transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl shadow-sm"
                            required
                        />
                    </div>
                    
                    <div className="flex items-center justify-end gap-3">
                        {parentId && (
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setIsReplying(false)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button 
                            type="submit" 
                            size="sm"
                            disabled={isPending}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-orange-200 flex items-center gap-2"
                        >
                            {isPending ? "Posting..." : (
                                <>
                                    <span>{parentId ? "Reply" : "Post Comment"}</span>
                                    <SendHorizontal className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            ) : (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 font-medium p-0 h-auto text-xs" 
                    onClick={() => setIsReplying(true)}
                >
                    Reply
                </Button>
            )}
        </div>
    );
}