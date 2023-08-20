import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import { ColorView } from "@/components/non-reusable/colors/colors-view";
import { ColorsColumn } from "@/components/non-reusable/colors/columns";

export default async function ColorPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  const colors = await prismadb.color.findMany( {
    where: { storeId: storeId },
    orderBy: { createdAt: "desc" },
  } );

  const formattedColors: ColorsColumn[] = colors.map( ( color ) => ( {
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format( color.createdAt, "MMMM do, yyyy" ),
    updatedAt: format( color.updatedAt, "MMMM do, yyyy" ),
  } ) );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorView data={ formattedColors } />
      </div>
    </div>
  )
}
