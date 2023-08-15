import prismadb from "@/lib/prismadb"

import { BillboardForm } from "@/components/non-reusable/billboard/billboard-form"
import { CategoryForm } from "@/components/non-reusable/category/category-form"

interface CategoryPageProps
{
  params: {
    storeId: string
    categoryId: string
  }
}

export default async function FormBillboardPage (
  { params: {
    storeId,
    categoryId
  } }: CategoryPageProps
)
{
  const category = await prismadb.category.findUnique( {
    where: {
      id: categoryId
    }
  } )

  const billboards = await prismadb.billboard.findMany( {
    where: {
      storeId
    }
  } )

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm initialData={ category } billboards={ billboards } />
      </div>
    </div>
  )
}
