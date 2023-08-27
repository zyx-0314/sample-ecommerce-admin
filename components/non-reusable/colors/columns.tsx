"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "@/components/ui/cell-action"
import { formattedHeader } from "@/components/ui/table-header"

export type ColorsColumn = {
  id: string
  name: string,
  value: string,
  createdAt: string
  updatedAt: string
}

export const columnsColorsDef: ColumnDef<ColorsColumn>[] = [
  {
    accessorKey: "name",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Name",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "value",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Value",
      hasSort: true,
    } ),
    cell: ( { row } ) => <div className="flex items-center gap-x-2">
      <div
        className="w-6 h-6 rounded-full border border-black"
        style={ { backgroundColor: row.original.value } }
      />
      { row.original.value }
    </div>
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
    cell: ( { row } ) => <CellAction data={ row.original.id } table='colors' />
  },
]
