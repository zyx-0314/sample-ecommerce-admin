import prismadb from "@/lib/prismadb"

import { BillboardForm } from "@/components/non-reusable/billboard/billboard-form"

interface BillboardPageProps
{
  params: {
    storeId: string
    billboardId: string
  }
}

export default async function FormBillboardPage (
  { params: {
    storeId,
    billboardId
  } }: BillboardPageProps
)
{
  const billboard = await prismadb.billboard.findUnique( {
    where: {
      id: billboardId
    }
  } )
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm initialData={ billboard } />
      </div>
    </div>
  )
}
