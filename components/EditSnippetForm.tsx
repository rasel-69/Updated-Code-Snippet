'use client'

import { Snippet } from '@/lib/generated/prisma/client'
import { Editor } from '@monaco-editor/react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { saveSnippet } from '@/actions' 

const EditSnippetForm = ({ snippet }: { snippet: Snippet }) => {
    const [code, setCode] = useState(snippet.code)

    const changeEventHangler = (value: string = "") => {
        setCode(value)
    }

    // We bind the current 'code' state so that edits are actually saved
    const saveSnippetAction = saveSnippet.bind(null, snippet.id, code);

    return (
        <div>
            <Button variant="ghost" asChild className="mb-4 bg-gray-300">
                <Link href={`/snippet/${snippet.id}`}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Snippet
                </Link>
            </Button>

            <div className='flex flex-col gap-4'>
                <h1 className='text-center text-orange-400 font-bold'>Your Code Editor</h1>
                <Editor
                    height="60vh"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    // Use defaultValue for the initial load
                    defaultValue={snippet.code} 
                    onChange={changeEventHangler}
                />
            </div>

            <form action={saveSnippetAction} className='mx-auto max-w-lg'>
                <Button type="submit" className='bg-green-400 text-black font-bold text-2xl h-14 w-full mt-2.5'>
                    Save Changes
                </Button>
            </form>
        </div>
    )
}

export default EditSnippetForm