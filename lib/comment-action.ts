'use server'

import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function addCommentAction(formData: FormData) {
    const text = formData.get("text") as string;
    const snippetId = parseInt(formData.get("snippetId") as string);
    const rawParentId = formData.get("parentId");
    const parentId = rawParentId ? parseInt(rawParentId as string) : null;

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) throw new Error("Unauthorized");
    const user = JSON.parse(userCookie.value);

    const comment = await prisma.comment.create({
        data: { text, snippetId, userId: user.id, parentId }
    });

    const snippet = await prisma.snippet.findUnique({
        where: { id: snippetId },
        select: { userId: true }
    });

    if (snippet && snippet.userId !== user.id) {
        await prisma.notification.create({
            data: {
                userId: snippet.userId,
                actorName: user.name || "A user",
                type: "COMMENT",
                snippetId: snippetId,
            }
        });
    }

    revalidatePath(`/snippet/${snippetId}`);
    revalidatePath(`/`);
}

export async function deleteCommentAction(commentId: number, snippetId: number) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) throw new Error("Unauthorized");
    const user = JSON.parse(userCookie.value);

    // Check if user is author OR snippet owner
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        include: { snippet: true }
    });

    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== user.id && comment.snippet.userId !== user.id) {
        throw new Error("Unauthorized to delete this comment");
    }

    await prisma.comment.delete({
        where: { id: commentId }
    });
    
    revalidatePath(`/snippet/${snippetId}`);
}

export async function editCommentAction(commentId: number, snippetId: number, text: string) {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) throw new Error("Unauthorized");
    const user = JSON.parse(userCookie.value);

    await prisma.comment.update({
        where: { id: commentId, userId: user.id },
        data: { text }
    });
    
    revalidatePath(`/snippet/${snippetId}`);
}

export async function markAsReadAction(notificationId: string) {
    await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });
    revalidatePath('/');
}