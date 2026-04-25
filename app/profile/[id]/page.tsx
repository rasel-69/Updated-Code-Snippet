import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Plus, User as UserIcon } from "lucide-react";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Verify access
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) redirect("/login");
    const loggedInUser = JSON.parse(userCookie.value);

    // 2. Fetch User along with their specific snippets
    const profileUser = await prisma.user.findUnique({
        where: { id },
        include: {
            snippets: {
                orderBy: { id: 'desc' }
            }
        }
    });

    if (!profileUser) return <div className="text-center py-20">User not found</div>;

    const isOwnProfile = loggedInUser.id === profileUser.id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sidebar: User Info */}
                <div className="md:col-span-1">
                    <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <UserIcon className="w-12 h-12 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-bold">{profileUser.name}</h2>
                            <p className="text-gray-500 text-sm">{profileUser.email}</p>
                        </div>

                        <div className="mt-8 border-t pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Snippets</span>
                                <span className="font-bold">{profileUser.snippets.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Followers</span>
                                <span className="font-bold text-blue-500">0</span> {/* Placeholder for future */}
                            </div>
                        </div>

                        {isOwnProfile && (
                            <Link href={`/snippet/new?from=profile&userId=${profileUser.id}`} className="mt-6 block">
                                <Button className="w-full bg-green-500 hover:bg-green-600 text-white gap-2">
                                    <Plus className="w-4 h-4" /> Create New
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Main Content: User's Snippets */}
                <div className="md:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            <Code2 className="text-orange-500" />
                            {isOwnProfile ? "My Snippets" : `${profileUser.name}'s Snippets`}
                        </h3>

                        <Button variant="ghost" asChild className=" text-orange-500">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    {profileUser.snippets.length === 0 ? (
                        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-20 text-center">
                            <p className="text-gray-400 italic">No snippets found in this library.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {profileUser.snippets.map((snippet) => (
                                <div
                                    key={snippet.id}
                                    className="bg-white border rounded-lg p-5 hover:border-orange-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-lg text-gray-800">{snippet.title}</h4>
                                            <p className="text-sm text-gray-400 mt-1 line-clamp-1 max-w-md">
                                                {snippet.code.substring(0, 80)}...
                                            </p>
                                        </div>
                                        <Link href={`/snippet/${snippet.id}?from=profile&userId=${profileUser.id}`}>
                                            <Button variant="outline" className="group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                Open Snippet
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}