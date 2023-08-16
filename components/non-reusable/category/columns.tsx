"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CellAction } from "@/components/ui/cell-action"
import { formattedHeader } from "@/components/ui/table-header"

export type CategoryColumn = {
  id: string
  name: string
  billboardLabel: string
  createdAt: string
  updatedAt: string
}

export const columnsCategoryDef: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Name",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ( { row } ) => row.original.billboardLabel,
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
    cell: ( { row } ) => <CellAction data={ row.original.id } table='categories' />
  },
]
