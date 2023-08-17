'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { SizeColumn, columnsSizeDef } from "@/components/non-reusable/sizes/columns";

interface SizeViewProps
{
  data: SizeColumn[]
}

export const SizeView = ( { data }: SizeViewProps ) =>
{
  const router = useRouter()
  const params = useParams()

  const handleAddNewColors = () => router.push( `/${ params.storeId }/sizes/new` )

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Sizes (${ data.length })` }
          description="Manage your sizes"
        />
        <Button onClick={ () => handleAddNewColors() }>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>

      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={ columnsSizeDef }
        data={ data }
      />
      <Heading title="API" description="API for sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizesId" />
    </>
  )
}