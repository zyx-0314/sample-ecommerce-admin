import { Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface dataProps
{
  id: string,
  value: string,
  name?: string
}

interface FacetSelectionProps
{
  data: dataProps[]
  selectedData: dataProps[]
  onChange: ( value: string, id: string ) => void
  isColor?: boolean
  disable?: boolean
}

const FacetSelection = (
  { data, selectedData, onChange, isColor, disable }: FacetSelectionProps
) =>
{
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size='icon' className='px-2 border w-full flex justify-start items-center gap-x-2' disabled={ disable }>
          <Palette className="h-6 w-6" />
          <Separator orientation="vertical" className="ml-2 h-4 bg-white" />
          <div className="flex gap-x-1">
            {
              selectedData.map( ( { value, id } ) => (
                <span key={ id } style={ { background: value } } className="h-6 w-6 rounded-full border-2 p-2 border-gray-500" />
              ) )
            }
          </div>
        </Button>

      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="w-full p-[5px]">
          {
            data.map( ( { value, name, id } ) => (
              <>
                { isColor
                  ?
                  <div
                    className="flex rounded-sm gap-x-2 p-2 items-center cursor-pointer hover:bg-gray-900"
                    onClick={ () => onChange( value, id ) }
                    key={ id }
                  >
                    <span style={ { background: value } } className="h-6 w-6 rounded-full border-2 p-2 border-gray-500" />
                    { name }
                  </div>
                  :
                  <div></div>
                }
              </>
            ) )
          }
          { selectedData.length > 0 &&
            <div onClick={ () => onChange( 'reset', '0' ) }>
              <Separator className="my-1" />
              <div className="p-2 items-center cursor-pointer hover:bg-gray-900 rounded-sm">Reset</div>
            </div>
          }
        </div>

      </PopoverContent>
    </Popover>
  )
}

export default FacetSelection