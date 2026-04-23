
'use client'

import { useState } from 'react';
import { Button } from './ui/button';
import { deleteSnippetAction} from '@/lib/snippet-action'; // Adjust path to your actions file
import { toast } from 'sonner';

export default function DeleteSnippetButton({ id }: { id: number }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this snippet?")) return;

        setLoading(true);
        try {
            await deleteSnippetAction(id);
            toast.success("Snippet deleted successfully");
        } catch (error) {
            toast.error("Failed to delete snippet");
            setLoading(false);
        }
    };

    return (
        <Button 
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="bg-red-300 text-white hover:bg-red-700"
        >
            {loading ? "Deleting..." : "Delete"}
        </Button>
    );
}