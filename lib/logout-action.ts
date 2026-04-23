'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signout() {
  const cookieStore = await cookies();
  
  // Delete the cookie you named "user"
  cookieStore.delete("user");
  
  // Send the user back to the home page
  redirect("/");
}