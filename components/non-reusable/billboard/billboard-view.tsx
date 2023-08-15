'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { WarningSign } from "@/components/ui/warning-sign";
import { BillboardColumn, columnsBillboardDef } from "@/components/non-reusable/billboard/columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

interface BillboardViewProps
{
  data: BillboardColumn[]
}

export const BillboardView = ( { data }: BillboardViewProps ) =>
{
  const router = useRouter()
  const params = useParams()

  const handleAddNewBillboard = () => router.push( `/${ params.storeId }/billboards/new` )

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Billboards (${ data.length })` }
          description="Manage your billboards"
        />
        <Button onClick={ () => handleAddNewBillboard() }>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>

      </div>
      <Separator />
      <DataTable
        columns={ columnsBillboardDef }
        data={ data }
      />
      <Heading title="API" description="API for billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  )
}