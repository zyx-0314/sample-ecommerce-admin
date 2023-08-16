import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ProductView } from "@/components/non-reusable/products/product-view";
import { ProductColumn } from "@/components/non-reusable/products/columns";
import { formatter } from "@/lib/utils";

export default async function ProductPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  //from prismadb in category table, find many where storeId is equal to storeId and return list of names
  const categories = await prismadb.category.findMany( {
    where: {
      storeId
    },
    select: {
      name: true
    }
  } )

  const sizes = await prismadb.size.findMany( {
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
    },
    select: {
      name: true
    }
  } )

  const products = await prismadb.product.findMany( {
    where: { storeId: storeId },
    include: { category: true, size: true, color: true },
    orderBy: { createdAt: "desc" },
  } );

  const formattedProducts: ProductColumn[] = products.map( ( product ) => ( {
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format( product.price.toNumber() ),
    category: product.category.name,
    size: product.size.name,
    color: product.color.name,
    createdAt: format( product.createdAt, "MMMM do, yyyy" ),
    updatedAt: format( product.updatedAt, "MMMM do, yyyy" ),
  } ) );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductView
          data={ formattedProducts }
          categories={ categories }
          sizes={ sizes }
          colors={ colors }
        />
      </div>
    </div>
  )
}
