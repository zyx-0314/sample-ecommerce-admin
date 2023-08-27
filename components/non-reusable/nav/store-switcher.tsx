'use client'

import { useState } from "react"
import { CommandGroup } from "cmdk"
import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import
{
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"
import { useStoreModal } from "@/hooks/use-store-modal"

type PopoverTriggereProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggereProps
{
  storeList: Store[]
}

export const StoreSwitcher = ( {
  className,
  storeList = [],
}: StoreSwitcherProps ) =>
{
  const storeModal = useStoreModal()
  const params = useParams()
  const router = useRouter()
  const [ open, setOpen ] = useState( false )

  const formattedStoreList = storeList.map( ( store ) => ( {
    label: store.name,
    value: store.id,
  } ) )

  const currentStore = formattedStoreList.find( ( store ) => store.value === params.storeId )

  const handleStoreSelect = ( store: { value: string, label: string } ) =>
  {
    setOpen( false )
    router.push( `/${ store.value }` )
  }

  return (
    <>
      <Popover open={ open } onOpenChange={ setOpen }>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size='sm'
            role="combobox"
            aria-expanded={ open }
            aria-label="Select a store"
            className={ cn( 'w-[200px] justify-between', className ) }
          >
            <StoreIcon className="mr-2 h-4 w-4" />
            <p className="truncate">
              { currentStore?.label }
            </p>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search Store..." />
              <CommandEmpty>No Store Found.</CommandEmpty>
              <CommandGroup heading='-- Stores --'>
                { formattedStoreList.map( ( store ) => (
                  <CommandItem
                    key={ store.value }
                    onSelect={ () => handleStoreSelect( store ) }
                    className="text-sm"
                  >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    { store.label }
                    <Check
                      className={ cn(
                        'ml-auto h-4 w-4',
                        currentStore?.value === store.value
                          ? "opacityy-100"
                          : "opacity-0"
                      ) }
                    />
                  </CommandItem>
                ) ) }
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={ () =>
                  {
                    setOpen( false )
                    storeModal.onOpen()
                  } }
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Store
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
