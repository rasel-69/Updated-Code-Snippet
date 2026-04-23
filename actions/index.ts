"use server"

import prisma from "@/lib/db";
import { redirect } from "next/navigation";



export const saveSnippet = async (id: number, code: string) => {
    //. Updating  the database
    await prisma.snippet.update({
        where: {
            id
        },
        data: {
            code
        }
    });

    //  Use the 'id' variable directly
    redirect(`/snippet/${id}`);
}







