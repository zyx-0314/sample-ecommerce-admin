"use client"

import { ColumnDef } from "@tanstack/react-table"

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
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Caption",
      hasSort: true,
    } ),
    cell: ( { row } ) => row.original.billboardLabel,
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
    cell: ( { row } ) => <CellAction data={ row.original.id } table='categories' />
  },
]
