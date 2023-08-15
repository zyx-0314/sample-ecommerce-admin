import prismadb from "@/lib/prismadb"
import { redirect } from "next/navigation"
import { UserButton, auth } from "@clerk/nextjs"

import { MainNav } from "@/components/non-reusable/nav/main-nav"
import { StoreSwitcher } from "@/components/non-reusable/nav/store-switcher"

export const Navbar = async () =>
{
  const { userId } = auth()

  if ( !userId ) redirect( '/sign-in' )

  const storesListbyUser = await prismadb.store.findMany( {
    where: {
      userId,
    },
  } )

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher storeList={ storesListbyUser } />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
