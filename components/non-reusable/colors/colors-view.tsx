'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ColorsColumn, columnsColorsDef } from "@/components/non-reusable/colors/columns";
import { useEffect, useState } from "react";

interface ColorViewProps
{
  data: ColorsColumn[]
}

export const ColorView = ( { data }: ColorViewProps ) =>
{
  const [ isMounted, setIsMounted ] = useState( false )

  useEffect( () => setIsMounted( true ), [] )

  if ( !isMounted ) return null

  const router = useRouter()
  const params = useParams()

  const handleAddNewColors = () => router.push( `/${ params.storeId }/colors/new` )

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Colors (${ data.length })` }
          description="Manage your color"
        />
        <Button onClick={ () => handleAddNewColors() }>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>

      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={ columnsColorsDef }
        data={ data }
      />
      <Heading title="API" description="API for colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  )
}