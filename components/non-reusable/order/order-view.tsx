'use client'

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columnsOrderDef } from "@/components/non-reusable/order/columns";

interface OrderViewProps
{
  data: OrderColumn[]
}

export const OrderView = ( { data }: OrderViewProps ) =>
{
  const [ isMounted, setIsMounted ] = useState( false )
  const router = useRouter()
  const params = useParams()

  useEffect( () => setIsMounted( true ), [] )

  if ( !isMounted ) return null


  const handleAddNewOrder = () => router.push( `/${ params.storeId }/orders/new` )

  return (
    <>
      <Heading
        title={ `Orders (${ data.length })` }
        description="Manage your orders"
      />
      <Separator />
      <DataTable
        searchKey="products"
        columns={ columnsOrderDef }
        data={ data }
      />
    </>
  )
}