'use client'

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { CategoryColumn, columnsCategoryDef } from "./columns";

interface CategoryViewProps
{
  data: CategoryColumn[]
}

export const CategoryView = ( { data }: CategoryViewProps ) =>
{
  const router = useRouter()
  const params = useParams()

  const handleAddNewCategory = () => router.push( `/${ params.storeId }/categories/new` )

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Categories (${ data.length })` }
          description="Manage your categories"
        />
        <Button onClick={ () => handleAddNewCategory() }>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>

      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={ columnsCategoryDef }
        data={ data }
      />
      <Heading title="API" description="API for categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  )
}