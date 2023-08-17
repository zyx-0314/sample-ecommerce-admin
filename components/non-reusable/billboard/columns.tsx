"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CellAction } from "@/components/ui/cell-action"
import { formattedHeader } from "@/components/ui/table-header"

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
  updatedAt: string
}

export const columnsBillboardDef: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "label",
      hasSort: true,
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
    cell: ( { row } ) => <CellAction data={ row.original.id } table="billboards" />
  },
]
