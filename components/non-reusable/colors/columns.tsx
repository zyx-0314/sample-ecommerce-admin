"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
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
      { row.original.value }
      <div
        className="w-6 h-6 rounded-full"
        style={ { backgroundColor: row.original.value } }
      />
    </div>
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
    cell: ( { row } ) => <CellAction data={ row.original.id } table='colors' />
  },
]
