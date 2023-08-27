import { formatDistanceToNow } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { ProductColumn } from "@/components/non-reusable/products/columns";
import { ProductView } from "@/components/non-reusable/products/product-view";

export default async function ProductPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  const categories = await prismadb.category.findMany( {
    where: {
      storeId
    },
    select: {
      name: true
    }
  } )

  const colors = await prismadb.color.findMany( {
    where: {
      storeId
    }
  } )

  const products = await prismadb.product.findMany( {
    where: { storeId: storeId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  } );


  const formattedProducts: ProductColumn[] = products.map( ( product ) =>
  {
    const convertedColor =
      product.color.split( ',' ).map( ( color ) => (
        colors.find( ( { id } ) => id === color )?.value
      ) )
      ;

    return {
      subName: product.subName,
      id: product.id,
      name: product.name,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      price: formatter.format( product.price ),
      category: product.category.name,
      size: product.size,
      color: convertedColor.flat(),
      stock: product.stock,
      createdAt: formatDistanceToNow( product.createdAt ),
      updatedAt: formatDistanceToNow( product.updatedAt ),
    }
  } );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductView
          data={ formattedProducts }
          categories={ categories }
          colors={ colors }
        />
      </div>
    </div>
  )
}
