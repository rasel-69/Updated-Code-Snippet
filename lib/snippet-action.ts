'use server'

import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSnippetAction(formData: FormData) {
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;

    // getting user from cookies
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
        return { error: "You must be logged in" };
    }

    const user = JSON.parse(userCookie.value);

    // for database operation
    try {
        await prisma.snippet.create({
            data: {
                title,
                code,
                userId: user.id // Correctly linking the snippet to the user
            }
        });
    } catch (e) {
        console.error("Prisma Error:", e);
        return { error: "Database error. Please try again." };
    }


    // revalidatePath ensures the Home page shows the new snippet immediately
    revalidatePath("/");

    // Move redirect OUTSIDE the try/catch block
    redirect("/");
}


export async function deleteSnippetAction(id: number) {
    // 1. Authenticate the user
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
        throw new Error("Authentication required");
    }

    const user = JSON.parse(userCookie.value);

    // user snippet ar malik naki seita dekha 
    const snippet = await prisma.snippet.findUnique({
        where: { id }
    });

    if (!snippet || snippet.userId !== user.id) {
        throw new Error("Unauthorized: You can only delete your own snippets");
    }

    // deleting in database too 
    try {
        await prisma.snippet.delete({
            where: { id }
        });
    } catch (e) {
        console.error("Delete Error:", e);
        throw new Error("Failed to delete snippet from database");
    }

    // redirecting 
    revalidatePath("/");
    redirect("/");
}





