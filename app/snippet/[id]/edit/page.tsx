import EditSnippetForm from '@/components/EditSnippetForm'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const EditPageSnippet = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {

  // Fetching id then Fetching The snippet from Database using prisma
  const id = parseInt((await params).id)

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  const currentUser = userCookie ? JSON.parse(userCookie.value) : null;

  const snippet = await prisma.snippet.findUnique({
    where: {
      id,
    }
  })

  if (!snippet) return <h1>Snippet Not found</h1>


  //security checking for user can not get from browser api too 
  if (!currentUser || snippet.userId !== currentUser.id) {
    redirect(`/snippet/${id}`)
  }


  return (

    <EditSnippetForm snippet={snippet} />
    

  )
}

export default EditPageSnippet
