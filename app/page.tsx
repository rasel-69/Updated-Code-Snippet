export const dynamic = "force-dynamic";
import NotificationBell from "@/components/NotificationBell";
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
  let notifications: any[] = [];

  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value);
      // Fetch notifications for the logged-in user
      notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
    } catch { }
  }

  console.log("user is from navbar home page", user)


  return (
    <div>
      <nav className="flex items-center justify-between bg-gray-100 h-16 px-4 mb-8 rounded shadow-sm">
        <h1 className="font-bold text-2xl text-orange-600">SnippetApp</h1>

        <div className="flex items-center gap-6">
          {user && <NotificationBell notifications={notifications} />}

          <div className="text-sm font-medium hover:text-orange-600 transition-colors">
            {user ? (
              <Link href={`/profile/${user.id}`} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-700">
                  {user.name[0]}
                </div>
                <span>{user.name}</span>
              </Link>
            ) : (
              ""
            )}
          </div>

          <div className="flex gap-2">
            {user ? (
              <form action={signout}><Button variant="destructive" type="submit">Sign Out</Button></form>
            ) : (
              <Link href="/login"><Button>Login</Button></Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-orange-500">Snippets</h1>

          {user ? (
            /* jodi logged in hoi then go to create page  */
            <Link href="/snippet/new">
              <Button className="bg-green-400 text-black w-24">
                Create New
              </Button>
            </Link>
          ) : (
            /* Not logged go to login first */
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
