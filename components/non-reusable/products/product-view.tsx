'use client'

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ProductColumn, columnsProductDef, filterSetter } from "@/components/non-reusable/products/columns";

interface ProductViewProps
{
  data: ProductColumn[]
  categories: { name: string }[]
  colors: { name: string }[]
}

export const ProductView = ( { data, categories, colors }: ProductViewProps ) =>
{
  const [ isMounted, setIsMounted ] = useState( false )
  const router = useRouter()
  const params = useParams()

  useEffect( () => setIsMounted( true ), [] )

  if ( !isMounted ) return null

  // this set filter options for headings
  filterSetter( {
    color: colors.map( item => item.name ),
    category: categories.map( item => item.name )
  } )

  const handleAddNewProduct = () => router.push( `/${ params.storeId }/products/new` )

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={ `Products (${ data.length })` }
          description="Manage your products"
        />
        <Button onClick={ () => handleAddNewProduct() }>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>

      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={ columnsProductDef }
        data={ data }
      />
      <Heading title="API" description="API for products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  )
}