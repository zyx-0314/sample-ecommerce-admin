import prismadb from "@/lib/prismadb"

import { ProductForm } from "@/components/non-reusable/products/product-form"

interface ProductPageProps
{
  params: {
    storeId: string
    productsId: string
  }
  searchParams: {
    new: boolean
  }
}

export default async function FormProductPage (
  { params: {
    storeId,
    productsId
  }, searchParams
  }: ProductPageProps
)
{
  const categories = await prismadb.category.findMany( {
    where: {
      storeId
    }
  } )

  const colors = await prismadb.color.findMany( {
    where: {
      storeId
    }
  } )

  const product = await prismadb.product.findUnique( {
    where: {
      id: productsId
    },
    include: {
      images: true
    }
  } )

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm
          initialData={ product }
          categories={ categories }
          colors={ colors }
          duplicate={ searchParams.new }
        />
      </div>
    </div>
  )
}
