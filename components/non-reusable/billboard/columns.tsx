"use client"

import { ColumnDef } from "@tanstack/react-table"

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
      title: "Label",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "createdAt",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Created At",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "updatedAt",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Last Update",
      hasSort: true,
    } ),
  },
  {
    id: "actions",
    cell: ( { row } ) => <CellAction data={ row.original.id } table="billboards" />
  },
]
