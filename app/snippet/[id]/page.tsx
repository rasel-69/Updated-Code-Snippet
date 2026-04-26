import CommentForm from '@/components/CommentForm'
import CommentItem from '@/components/CommentItem'
import DeleteSnippetButton from '@/components/DeleteSnippetButton'
import FollowButton from '@/components/FollowButton'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

const SnippetDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; userId?: string }>;
}) => {
  const id = parseInt((await params).id);
  const { from, userId } = await searchParams;

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  let loggedInUser = userCookie ? JSON.parse(userCookie.value) : null;

  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      comments: {
        where: { parentId: null },
        include: { 
          user: true, 
          replies: { 
            include: { 
              user: true,
              replies: { include: { user: true } }
            } 
          } 
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!snippet) return <h1>Not found</h1>;
  const isOwner = loggedInUser && loggedInUser.id === snippet.userId;

  // Check if already following
  const existingFollow = loggedInUser ? await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId: loggedInUser.id, followingId: snippet.userId }
    }
  }) : null;

  const backPath = (from === 'profile' && userId) ? `/profile/${userId}` : "/";

  return (
    <div className='container mx-auto '>
      <Button variant="ghost" asChild className="mb-8 text-orange-500">
        <Link href={backPath}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {from === 'profile' ? "Back to Profile" : "Back to Home"}
        </Link>
      </Button>

      <div className='flex items-center justify-between'>

          <h1 className='text-2xl font-semibold'>{snippet.title}</h1>
          <div>
            {loggedInUser && !isOwner && (
            <FollowButton
              followerId={loggedInUser.id}
              followingId={snippet.userId}
              initialIsFollowing={!!existingFollow}
            />
          )}
          </div>


        {isOwner && (
          <div className='flex gap-4'>
            <Link href={`/snippet/${snippet.id}/edit`}>
              <Button className='bg-gray-600 hover:bg-green-400'>Edit</Button>
            </Link>
            <DeleteSnippetButton id={snippet.id} />
          </div>
        )}
      </div>

      <pre className='bg-gray-200 rounded p-6 mt-6 h-96 overflow-y-auto no-select'>
        <code>{snippet.code}</code>
      </pre>

      <section id="comments" className="mt-12">
    
          <h2 className="text-xl font-bold">Comments</h2>

        {loggedInUser ? <CommentForm snippetId={snippet.id} /> : <p className="text-gray-500 mt-4">Please login to join the conversation.</p>}

        <div className="mt-8 space-y-6">
          {snippet.comments.length > 0 ? (
            snippet.comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                snippetId={snippet.id}
                currentUserId={loggedInUser?.id}
                snippetOwnerId={snippet.userId}
              />
            ))
          ) : (
            <p className="text-gray-400 italic">No comments yet. Be the first to share your thoughts!</p>
          )}
        </div>
      </section>
    </div>
  )
}
export default SnippetDetailPage