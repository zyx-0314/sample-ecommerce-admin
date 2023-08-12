import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

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
      userId,
    },
  } )

  if ( !store ) redirect( '/' )

  return (
    <>
      <nav>Will be Nav Bar { store.name }</nav>
      <section>
        { children }
      </section>
    </>
  )
}
