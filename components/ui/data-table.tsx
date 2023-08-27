"use client"

import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  searchKey: string | string[]
}

export function DataTable<TData, TValue> ( {
  columns,
  data,
  searchKey,
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

  useEffect( () =>
  {
    table.getAllColumns().forEach( ( column ) =>
    {
      const toHide = [ 'createdAt', 'isArchived' ]
      if ( column === table.getColumn( 'id' ) || toHide.includes( column.id ) )
        column.toggleVisibility( false )
    } )
  }, [] )

  const cellFormat = ( cell: any ) =>
  {
    if ( cell.column.id.includes( 'updatedAt' ) || cell.column.id.includes( 'createdAt' ) )
      return 'w-min-fit max-w-[150px] text-center'
    else if ( cell.id.includes( 'actions' ) )
      return 'w-[1px] w-[min-content] text-center'
    else
      return 'w-[-webkit-fill-available] max-w-[300px] text-center'
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={ ( table.getColumn( Array.isArray( searchKey ) ? "" : searchKey )?.getFilterValue() as string ) ?? "" }
          onChange={ ( event: any ) =>
          {
            if ( !Array.isArray( searchKey ) )
              table.getColumn( searchKey )?.setFilterValue( event.target.value )
            else
            {
              searchKey.forEach( ( key ) =>
              {
                table.getColumn( key )?.setFilterValue( event.target.value )
              } )
            }
          }
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
              .map( ( column, index ) =>
              {
                return (
                  <DropdownMenuCheckboxItem
                    key={ 'column' + index }
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
            { table.getHeaderGroups().map( ( headerGroup, index ) => (
              <TableRow key={ 'headerGroup' + index }>
                { headerGroup.headers.map( ( header, index ) =>
                {
                  return (
                    <TableHead key={ 'tableHead' + index } id='label'>
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
              table.getRowModel().rows.map( ( row, index ) => (
                <TableRow
                  key={ 'tableRow' + index }
                  data-state={ row.getIsSelected() && "selected" }
                >
                  { row.getVisibleCells().map( ( cell, index ) => (
                    <TableCell key={ 'tableCell' + index } className={ cellFormat( cell ) }>
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center gap-x-4">
          <div className='text-sm'>
            Total { table.getRowModel().rows?.length } { table.getRowModel().rows?.length === 1 ? "item" : "items" }
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={ () => table.previousPage() }
            disabled={ !table.getCanPreviousPage() }
          >
            Prev
          </Button>
          <div className='mx-6 px-3 border-b-2 border-primary '>
            { table.getPageOptions()[ 0 ] ? table.getPageOptions()[ 0 ] + 1 : 1 }
          </div>
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
    </div>
  )
}
