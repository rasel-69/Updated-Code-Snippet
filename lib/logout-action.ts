'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./db";
import { revalidatePath } from "next/cache";

export async function signout() {
  const cookieStore = await cookies();
  
  // Delete the cookie you named "user"
  cookieStore.delete("user");
  
  // Send the user back to the home page
  redirect("/");
}



export async function followUserAction(followerId: string, followingId: string) {
    const follow = await prisma.follow.create({
        data: {
            followerId,
            followingId,
            status: "ACCEPTED" // Change to ACCEPTED so it updates counters immediately
        }
    });

    // Create Notification
    const follower = await prisma.user.findUnique({ where: { id: followerId } });
    
    await prisma.notification.create({
        data: {
            userId: followingId, // The person being followed
            actorName: follower?.name || "Someone",
            actorId: followerId, // CRITICAL: This is used for the Link in the Bell
            type: "FOLLOW",
        }
    });
    
    revalidatePath(`/profile/${followingId}`);
}




