'use client'

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { BillboardColumn, columnsBillboardDef } from "@/components/non-reusable/billboard/columns";

interface BillboardViewProps
{
  data: BillboardColumn[]
}

export const BillboardView = ( { data }: BillboardViewProps ) =>
{
  const router = useRouter()
  const params = useParams()

  const [ isMounted, setIsMounted ] = useState( false )

  useEffect( () => setIsMounted( true ), [] )

  if ( !isMounted ) return null


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
        searchKey="label"
        columns={ columnsBillboardDef }
        data={ data }
      />
      <Heading title="API" description="API for billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  )
}