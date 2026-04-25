'use server'

import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addCommentAction(formData: FormData) {
    const content = formData.get("content") as string;
    const snippetId = parseInt(formData.get("snippetId") as string);
    const parentId = formData.get("parentId") as string || null;

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) throw new Error("Unauthorized");
    const user = JSON.parse(userCookie.value);

    await prisma.comment.create({
        data: {
            content,
            snippetId,
            userId: user.id,
            parentId
        }
    });
    revalidatePath(`/snippet/${snippetId}`);
}

export async function deleteCommentAction(commentId: string, snippetId: number) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) throw new Error("Unauthorized");
    const user = JSON.parse(userCookie.value);

    // Ensure the user deleting the comment is the one who wrote it
    await prisma.comment.delete({
        where: { id: commentId, userId: user.id }
    });
    revalidatePath(`/snippet/${snippetId}`);
}

export async function editCommentAction(commentId: string, snippetId: number, content: string) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) throw new Error("Unauthorized");
    const user = JSON.parse(userCookie.value);

    await prisma.comment.update({
        where: { id: commentId, userId: user.id },
        data: { content }
    });
    revalidatePath(`/snippet/${snippetId}`);
}