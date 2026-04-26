'use server'

import prisma from "./db";
import { revalidatePath } from "next/cache";

export async function followUserAction(followerId: string, followingId: string) {
  try {
    // 1. Validation
    if (followerId === followingId) {
      return { error: "You cannot follow yourself." };
    }

    // 2. Check if already exists
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId }
      }
    });

    if (existing) return { error: "Request already sent." };

    // 3. Create Follow
    await prisma.follow.create({
      data: {
        followerId,
        followingId,
        status: "PENDING"
      }
    });

    // 4. Create Notification for the person being followed
    const actor = await prisma.user.findUnique({ 
      where: { id: followerId },
      select: { name: true }
    });

    await prisma.notification.create({
      data: {
        userId: followingId,
        actorName: actor?.name || "Someone",
        type: "FOLLOW",
      }
    });

    // 5. Refresh the UI
    revalidatePath(`/profile/${followingId}`);
    revalidatePath(`/snippet`);
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Database error occurred." };
  }
}