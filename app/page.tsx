import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { signout } from "@/lib/logout-action";
import { cookies } from "next/headers";
import Link from "next/link";




export default async function Home() {

  const snippets = await prisma.snippet.findMany();

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
    } catch { }
  }

  console.log("user is from navbar home page", user)


  return (
    <div>
      <nav className="flex items-center justify-between bg-gray-100 h-14 mb-8 rounded">
        <h1 className="font-semibold text-2xl">Home</h1>

         <h1 className="font-semibold text-2xl">
          {
            user? <p>{user.name}</p>: <p></p>
          }
         </h1>
        <div className="flex gap-2">
          {user ? (
            /* Use a form with a Server Action instead of a Link */
            <form action={signout}>
              <Button variant="destructive" type="submit">
                Sign Out
              </Button>
            </form>
          ) : (
            <>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </>
          )}
        </div>
        
      </nav>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-orange-500">Snippets</h1>

          {user ? (
            /* Logged in: Go straight to create page */
            <Link href="/snippet/new">
              <Button className="bg-green-400 text-black w-24">
                Create New
              </Button>
            </Link>
          ) : (
            /* Not logged in: Redirect to login first */
            <Link href="/login?callbackUrl=/snippet/new">
              <Button variant="outline" className="border-green-400 text-orange-500">
                Create New
              </Button>
            </Link>
          )}



        </div>

        {
          snippets.map((snippet) => (
            <div key={snippet.id}>

              <div className="flex items-center bg-green-200 justify-between p-4 transition duration-700 hover:-translate-y-1">
                <h1>{snippet.title}</h1>
                <Link href={`/snippet/${snippet.id}`}>
                  <Button className="bg-gray-400 text-gray-100 w-18">View</Button>
                </Link>

              </div>
            </div>
          ))
        }
      </div>


    </div>

  );
}
