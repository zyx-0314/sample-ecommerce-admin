import prismadb from "@/lib/prismadb"

import { SizeForm } from "@/components/non-reusable/sizes/sizes-form"

interface SizePageProps
{
  params: {
    storeId: string
    sizesId: string
  }
}

export default async function FormSizePage (
  { params: {
    storeId,
    sizesId
  } }: SizePageProps
)
{
  const sizes = await prismadb.size.findUnique( {
    where: {
      id: sizesId
    }
  } )
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm initialData={ sizes } />
      </div>
    </div>
  )
}
