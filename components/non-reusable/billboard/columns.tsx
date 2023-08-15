"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CellAction } from "@/components/non-reusable/billboard/cell-action"

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
  updatedAt: string
}

export const columnsBillboardDef: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: ( { column } ) =>
    {
      return (
        <Button
          variant="ghost"
          onClick={ () => column.toggleSorting( column.getIsSorted() === "asc" ) }
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
    cell: ( { row } ) => <CellAction data={ row.original } />
  },
]
