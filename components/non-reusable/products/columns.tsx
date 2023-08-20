"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "@/components/ui/cell-action"
import { formattedHeader } from "@/components/ui/table-header"

interface FilterValue
{
  size: string[]
  color: string[]
  category: string[]
}

let filterValue: FilterValue

export function filterSetter ( input: FilterValue )
{
  filterValue = {
    size: [ 'All', ...input.size ],
    color: [ 'All', ...input.color ],
    category: [ 'All', ...input.category ]
  }
}

export type ProductColumn = {
  id: string
  name: string
  isFeatured: boolean
  isArchived: boolean
  price: string
  category: string
  size: string
  color: string
  createdAt: string
  updatedAt: string
}

export const columnsProductDef: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Product Name",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "isFeatured",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Featured",
      hasBooleanFilter: true
    } ),
  },
  {
    accessorKey: "isArchived",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Archived",
      hasBooleanFilter: true
    } ),
  },
  {
    accessorKey: "price",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Price",
      hasSort: true,
    } ),
  },
  {
    accessorKey: "category",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Category",
      hasFilters: filterValue.category
    } ),
  },
  {
    accessorKey: "size",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Size",
      hasFilters: filterValue.size
    } ),
  },
  {
    accessorKey: "color",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Size",
      hasFilters: filterValue.color
    } ),
    cell: ( { row } ) =>
      <div className="flex items-center gap-x-2">
        <div
          className="w-6 h-6 rounded-full border-black border"
          style={ { backgroundColor: row.original.color } }
        />
        { row.original.color }
      </div>
  },
  {
    accessorKey: "createdAt",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Created At",
      hasSort: true
    } ),
  },
  {
    accessorKey: "updatedAt",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Last  Update",
      hasSort: true
    } ),
  },
  {
    id: "actions",
    cell: ( { row } ) => <CellAction data={ row.original.id } table="products" />
  },
]
