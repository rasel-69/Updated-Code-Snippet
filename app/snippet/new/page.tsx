'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import hljs from 'highlight.js'
import { createSnippetAction } from '@/lib/snippet-action' // our server action

const CreateSnippetPage = () => {
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) { 
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const code = formData.get("code") as string;


        // Update this part of your handleSubmit function:
        const detection = hljs.highlightAuto(code);

        // Change 5 to 0 or 1
        if (!detection.language || detection.relevance < 5) {
            setError("Write any Programming language");
            return;
        }

        

        setIsPending(true);
        // Call the server action
        const result = await createSnippetAction(formData);
        if (result?.error) {
            setError(result.error);
            setIsPending(false);
        }
    }

    const handleBlur = () => {
        setError("");
    }


    return (
        <div>
            <Button variant="ghost" asChild className="mb-8 text-orange-500">
                <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </Button>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div>
                    <Label className='mb-2 text-xl'>Title</Label>
                    <Input type="text" id="title" name="title" required />
                </div>

                <div>
                    <Label className='mb-2 text-xl'>Code</Label>
                    <Textarea id="code" name="code" className='h-72' required onBlur={handleBlur} />
                    {/* Red Error Message displaying */}
                    {error && (
                        <p className="text-red-500 font-medium mt-2">{error}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isPending}
                    className='bg-green-400 text-xl font-semibold h-14 text-black'
                >
                    {isPending ? "Saving..." : "Add Your Snippet"}
                </Button>
            </form>
        </div>
    )

}

export default CreateSnippetPage




