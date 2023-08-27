"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Check } from "lucide-react"
import { CellAction } from "@/components/ui/cell-action"
import { formattedHeader } from "@/components/ui/table-header"

interface FilterValue
{
  color: string[]
  category: string[]
}

let filterValue: FilterValue

export function filterSetter ( input: FilterValue )
{
  filterValue = {
    color: [ 'All', ...input.color ],
    category: [ 'All', ...input.category ]
  }
}

export type ProductColumn = {
  id: string
  subName?: string | undefined | null
  name: string
  isFeatured: boolean
  isArchived: boolean
  price: string
  category: string
  size: string
  color: any[]
  stock: number
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
    accessorKey: "subName",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Product Sub-Name",
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
    cell: ( { row } ) =>
      <div className="flex justify-center">
        {
          row.original.isFeatured
            ? <Check className="w-6 h-6" />
            : null
        }
      </div>
  },
  {
    accessorKey: "isArchived",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Archived",
      hasBooleanFilter: true
    } ),
    cell: ( { row } ) =>
      <div className="flex justify-center">
        {
          row.original.isArchived
            ? <Check className="w-6 h-6" />
            : null
        }
      </div>
  },
  {
    accessorKey: "price",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Price",
      hasSort: true,
    } ),
    cell: ( { row } ) =>
      <div className="flex items-center justify-center">
        { row.original.price }
      </div>
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
    } ),
  },
  {
    accessorKey: "color",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Color",
    } ),
    cell: ( { row } ) =>
      <div className="flex items-center justify-center gap-x-2">
        { row.original.color.map( ( color, index ) =>
          <div key={ index }>
            <div
              className="w-6 h-6 rounded-full border-black dark:border-white border"
              style={ { backgroundColor: color } }
            />
          </div>
        ) }
      </div>
  },
  {
    accessorKey: "stock",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Stock",
      hasSort: true,
    } ),
    cell: ( { row } ) =>
      <div className="flex items-center justify-center">
        { row.original.stock }
      </div>
  },
  {
    accessorKey: "createdAt",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Created At",
      hasSort: true
    } ),
    cell: ( { row } ) =>
      <div className="flex items-center justify-center">
        { row.original.createdAt }
      </div>

  },
  {
    accessorKey: "updatedAt",
    header: ( { column } ) => formattedHeader( {
      column,
      title: "Last Update",
      hasSort: true
    } ),
    cell: ( { row } ) =>
      <div className="flex items-center justify-center">
        { row.original.updatedAt }
      </div>
  },
  {
    id: "actions",
    cell: ( { row } ) => <CellAction data={ row.original.id } table="products" />
  },
]
