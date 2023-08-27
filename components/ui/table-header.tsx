import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import
{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FormattedHeaderProps
{
  column: any
  title: string
  hasSort?: boolean
  hasFilters?: string[]
  hasBooleanFilter?: boolean
}

const toggleActive = ( column: any ) =>
{
  !column.getFilterValue()
    ? column.setFilterValue( true )
    : column.setFilterValue( undefined )
}

export const formattedHeader = ( { column, title, hasSort, hasFilters, hasBooleanFilter }: FormattedHeaderProps ) =>
{
  const handleFilter = ( filter: string ) =>
  {
    if ( filter === "All" || column.getFilterValue() === filter ) column.setFilterValue( undefined )
    else column.setFilterValue( filter )
  }

  return (
    <div
      className={ `flex items-center justify-center ${ column.getFilterValue() ? 'border border-white rounded-sm bg-gray-900' : '' }` }
      onClick={ () =>
      {
        hasBooleanFilter && toggleActive( column )
      } }
    >
      <span className="py-2">
        { title }
      </span>
      { hasSort &&
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 ml-2"
          onClick={ () =>
          {
            column.toggleSorting( column.getIsSorted() === "asc" )
          } }
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      }
      { hasFilters &&
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
              hasFilters.map( ( filter, index ) => (
                <DropdownMenuItem key={ index } onClick={ () => handleFilter( filter ) } className={ column.getFilterValue() === filter ? 'bg-gray-900' : '' }>
                  { filter }
                </DropdownMenuItem>
              ) ) }
          </DropdownMenuContent>
        </DropdownMenu>
      }
    </div>
  )
}