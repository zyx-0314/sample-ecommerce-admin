"use client"

import { ColumnDef } from "@tanstack/react-table"

import { formattedHeader } from "@/components/ui/table-header"

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
  updatedAt: string
}

export const columnsOrderDef: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Products",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Total Price",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "isPaid",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Paid",
      hasBooleanFilter: true,
    } ),
  },
  {
    accessorKey: "createdAt",
    header: "Creation Date",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
  },
  {
    id: "actions",
    cell: ( { row } ) => <p>Should be cancelation etc.</p>
  },
]
