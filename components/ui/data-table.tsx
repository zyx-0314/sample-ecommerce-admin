"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import
{
  ColumnDef,
  flexRender,
  SortingState,
  useReactTable,
  VisibilityState,
  getCoreRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import
{
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import
{
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue>
{
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue> ( {
  columns,
  data,
}: DataTableProps<TData, TValue> )
{
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>(
    []
  )
  const [ columnVisibility, setColumnVisibility ] =
    useState<VisibilityState>( {} )
  const [ sorting, setSorting ] = useState<SortingState>( [] )
  const table = useReactTable( {
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  } )

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={ ( table.getColumn( "label" )?.getFilterValue() as string ) ?? "" }
          onChange={ ( event ) =>
            table.getColumn( "label" )?.setFilterValue( event.target.value )
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            { table
              .getAllColumns()
              .filter(
                ( column ) => column.getCanHide()
              )
              .map( ( column ) =>
              {
                return (
                  <DropdownMenuCheckboxItem
                    key={ column.id }
                    className="capitalize"
                    checked={ column.getIsVisible() }
                    onCheckedChange={ ( value: any ) =>
                      column.toggleVisibility( !!value )
                    }
                  >
                    { column.id }
                  </DropdownMenuCheckboxItem>
                )
              } ) }
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            { table.getHeaderGroups().map( ( headerGroup ) => (
              <TableRow key={ headerGroup.id }>
                { headerGroup.headers.map( ( header ) =>
                {
                  return (
                    <TableHead key={ header.id }>
                      { header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        ) }
                    </TableHead>
                  )
                } ) }
              </TableRow>
            ) ) }
          </TableHeader>
          <TableBody>
            { table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map( ( row ) => (
                <TableRow
                  key={ row.id }
                  data-state={ row.getIsSelected() && "selected" }
                >
                  { row.getVisibleCells().map( ( cell ) => (
                    <TableCell key={ cell.id }>
                      { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
                    </TableCell>
                  ) ) }
                </TableRow>
              ) )
            ) : (
              <TableRow>
                <TableCell colSpan={ columns.length } className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={ () => table.previousPage() }
          disabled={ !table.getCanPreviousPage() }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={ () => table.nextPage() }
          disabled={ !table.getCanNextPage() }
        >
          Next
        </Button>
      </div>
    </div>
  )
}
