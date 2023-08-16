"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CellAction } from "@/components/ui/cell-action"

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
    header: ( { column } ) =>
    {
      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting( column.getIsSorted() === "asc" ) }
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "value",
    header: ( { column } ) =>
    {
      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting( column.getIsSorted() === "asc" ) }
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ( { row } ) => <div className="flex items-center gap-x-2">
      { row.original.value }
      <div className="w-6 h-6 rounded-full" style={ { backgroundColor: row.original.value } } />
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
