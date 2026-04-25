

import CommentForm from '@/components/CommentForm'
import CommentItem from '@/components/CommentItem'
import DeleteSnippetButton from '@/components/DeleteSnippetButton'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import React from 'react'

const SnippetDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {

  const id = parseInt((await params).id);
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  let loggedInUser = userCookie ? JSON.parse(userCookie.value) : null;

  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      comments: {
        where: { parentId: null }, // Fetch only top-level
        include: { user: true, replies: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!snippet) return <h1>Not found</h1>;
  const isOwner = loggedInUser && loggedInUser.id === snippet.userId;


  return (
    <div className='container mx-auto'>

      <Button variant="ghost" asChild className="mb-8 text-orange-500">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>
      </Button>

      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{snippet.title}</h1>

        {
          isOwner && (
            <div className='flex flex-row gap-4'>
              <Link href={`/snippet/${snippet.id}/edit`}>
                <Button className='bg-gray-600 hover:bg-green-400 transition-colors duration-200'> Edit</Button>
              </Link>

              <DeleteSnippetButton id={snippet.id} />

            </div>
          )
        }

      </div>


      <pre className='bg-gray-200 border-gray-400 rounded p-6 mt-6 h-96 overflow-y-auto'>
        <code className="block">
          {snippet.code}
        </code>
      </pre>




      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        {loggedInUser ? <CommentForm snippetId={snippet.id} /> : <p>Login to comment</p>}

        <div className="mt-8 flex flex-col gap-8">
          {snippet.comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-orange-200 pl-4 py-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange-600">{comment.user.name}</span>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>

              <CommentItem comment={comment} snippetId={snippet.id} currentUserId={loggedInUser?.id} />

              {/* Reply Form */}
              {loggedInUser && <CommentForm snippetId={snippet.id} parentId={comment.id} placeholder="Reply..." />}

              {/* Replies List */}
              <div className="ml-8 mt-4 flex flex-col gap-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm">{reply.user.name}</span>
                    </div>
                    <CommentItem comment={reply} snippetId={snippet.id} currentUserId={loggedInUser?.id} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>


    </div>
  )
}

export default SnippetDetailPage
