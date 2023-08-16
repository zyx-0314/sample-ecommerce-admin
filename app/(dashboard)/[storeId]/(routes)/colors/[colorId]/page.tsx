import prismadb from "@/lib/prismadb"

import { ColorForm } from "@/components/non-reusable/colors/colors-form"

interface ColorPageProps
{
  params: {
    storeId: string
    colorId: string
  }
}

export default async function FormSizePage (
  { params: {
    storeId,
    colorId
  } }: ColorPageProps
)
{
  const color = await prismadb.color.findUnique( {
    where: {
      id: colorId
    }
  } )

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm initialData={ color } />
      </div>
    </div>
  )
}
