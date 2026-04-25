

'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { addCommentAction } from "@/lib/comment-action";

export default function CommentForm({ snippetId, parentId, placeholder = "Add a comment..." }: { snippetId: number, parentId?: string, placeholder?: string }) {
    const [isReplying, setIsReplying] = useState(false);

    return (
        <div className="mt-2">
            {!parentId || isReplying ? (
                <form action={async (formData) => {
                    await addCommentAction(formData);
                    setIsReplying(false);
                }} className="flex flex-col gap-2">
                    <input type="hidden" name="snippetId" value={snippetId} />
                    {parentId && <input type="hidden" name="parentId" value={parentId} />}
                    <textarea 
                        name="content" 
                        placeholder={placeholder}
                        className="border rounded p-2 text-sm w-full"
                        required
                    />
                    <div className="flex gap-2">
                        <Button type="submit" className="bg-gray-500 w-16 hover:bg-amber-400">Post</Button>
                        {parentId && <Button type="button" variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>}
                    </div>
                </form>
            ) : (
                <Button variant="link" size="sm" className="text-blue-500 text-sm" onClick={() => setIsReplying(true)}>Reply</Button>
            )}
        </div>
    );
}