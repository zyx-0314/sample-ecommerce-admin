import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import
{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

interface FormattedHeaderProps
{
  column: any
  title: string
  hasSort?: boolean
  hasFilters?: string[]
  hasBooleanFilter?: boolean
}

export const formattedHeader = ( { column, title, hasSort, hasFilters, hasBooleanFilter }: FormattedHeaderProps ) =>
{
  return (
    <div className="flex items-center">
      { title }
      { hasSort &&
        <Button
          variant="ghost"
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
                <DropdownMenuItem key={ index } onClick={ () =>
                {
                  if ( filter === "All" ) column.setFilterValue( undefined )
                  else column.setFilterValue( filter )
                } }
                >
                  { filter }
                </DropdownMenuItem>
              ) ) }
          </DropdownMenuContent>
        </DropdownMenu>
      }
      {
        hasBooleanFilter &&
        <Checkbox
          className="ml-4"
          onClick={ () =>
          {
            if ( !column.getFilterValue() ) column.setFilterValue( true )
            else column.setFilterValue( undefined )
          }
          }
        />
      }
    </div>
  )
}