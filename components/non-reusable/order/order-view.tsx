'use client'

import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columnsOrderDef } from "@/components/non-reusable/order/columns";
import { useEffect, useState } from "react";

interface OrderViewProps
{
  data: OrderColumn[]
}

export const OrderView = ( { data }: OrderViewProps ) =>
{
  const [ isMounted, setIsMounted ] = useState( false )

  useEffect( () => setIsMounted( true ), [] )

  if ( !isMounted ) return null

  const router = useRouter()
  const params = useParams()

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