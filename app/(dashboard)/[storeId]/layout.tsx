import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation"

import { Navbar } from "@/components/non-reusable/navbar"

interface DashboardLayoutProps
{
  children: React.ReactNode
  params: {
    storeId: string
  }
}

export default async function DashboardLayout ( { children, params }: DashboardLayoutProps )
{
  const { userId } = auth()
  if ( !userId ) redirect( '/sign-in' )

  const store = await prismadb.store.findFirst( {
    where: {
      id: params.storeId,
    },
  } )

  if ( !store ) redirect( '/' )

  return (
    <>
      <Navbar />
      <section>
        { children }
      </section>
    </>
  )
}
