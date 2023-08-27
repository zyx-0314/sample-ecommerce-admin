import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "@/components/non-reusable/billboard/columns";
import { BillboardView } from "@/components/non-reusable/billboard/billboard-view";

export default async function BillboardPage (
  { params: { storeId } }: { params: { storeId: string } }
)
{
  const billboards = await prismadb.billboard.findMany( {
    where: { storeId: storeId },
    orderBy: { createdAt: "desc" },
  } );

  const formattedBillboards: BillboardColumn[] = billboards.map( ( billboard ) => ( {
    id: billboard.id,
    label: billboard.label,
    createdAt: format( billboard.createdAt, "MMMM do, yyyy" ),
    updatedAt: format( billboard.updatedAt, "MMMM do, yyyy" ),
  } ) );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardView data={ formattedBillboards } />
      </div>
    </div>
  )
}
