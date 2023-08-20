import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { SizeView } from "@/components/non-reusable/sizes/sizes-view";
import { SizeColumn } from "@/components/non-reusable/sizes/columns";

export default async function SizesPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  const sizes = await prismadb.size.findMany( {
    where: { storeId: storeId },
    orderBy: { createdAt: "desc" },
  } );

  const formattedSizes: SizeColumn[] = sizes.map( ( size ) => ( {
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format( size.createdAt, "MMMM do, yyyy" ),
    updatedAt: format( size.updatedAt, "MMMM do, yyyy" ),
  } ) );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeView data={ formattedSizes } />
      </div>
    </div>
  )
}
