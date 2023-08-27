import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "@/components/non-reusable/category/columns";
import { CategoryView } from "@/components/non-reusable/category/category-view";

export default async function CategoryPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  const categories = await prismadb.category.findMany( {
    where: { storeId: storeId },
    include: { billboard: true },
    orderBy: { createdAt: "desc" },
  } );

  const formattedCategories: CategoryColumn[] = categories.map( ( category ) => ( {
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format( category.createdAt, "MMMM do, yyyy" ),
    updatedAt: format( category.updatedAt, "MMMM do, yyyy" ),
  } ) );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryView data={ formattedCategories } />
      </div>
    </div>
  )
}
