'use client'

import Link from "next/link";
import { Menu } from 'lucide-react'
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import
{
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const MobileMainNav = () =>
{
  const pathname = usePathname()
  const params = useParams();
  const routes = [
    {
      href: `/${ params.storeId }`,
      label: 'Dashboard',
      active: pathname === `/${ params.storeId }`
    },
    {
      href: `/${ params.storeId }/products`,
      label: 'Products',
      active: pathname === `/${ params.storeId }/products`
    },
    {
      href: `/${ params.storeId }/orders`,
      label: 'Orders',
      active: pathname === `/${ params.storeId }/orders`
    },
    {
      href: `/${ params.storeId }/billboards`,
      label: 'Billboards',
      active: pathname === `/${ params.storeId }/billboards`
    },
    {
      href: `/${ params.storeId }/categories`,
      label: 'Categories',
      active: pathname === `/${ params.storeId }/categories`
    },
    {
      href: `/${ params.storeId }/colors`,
      label: 'Colors',
      active: pathname === `/${ params.storeId }/colors`
    },
    {
      href: `/${ params.storeId }/settings`,
      label: 'Settings',
      active: pathname === `/${ params.storeId }/settings`
    },
  ]

  return (
    <div className="hidden sm:block">
      <Sheet>
        <SheetTrigger>
          <div
            className="border rounded-md p-2 cursor-pointer hover:bg-gray-200 transition-all dark:hover:bg-slate-900"
          >
            <Menu className='h-6 w-6' />
          </div>
        </SheetTrigger>
        <SheetContent>
          <nav
            className={ cn( 'pt-5 flex flex-col space-x-4 space-y-6', ) }
          >
            { routes.map( ( { href, label, active } ) => (
              <Link
                key={ href } href={ href }
                className={ cn( 'text-md font-medium transition-colors', active ? 'text-black dark:text-white' : 'text-gray-500 hover:text-primary' ) }
              >
                <SheetClose>
                  { label }
                </SheetClose>
              </Link>
            ) ) }
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )

}

export default MobileMainNav