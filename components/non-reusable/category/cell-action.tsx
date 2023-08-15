'use client'

import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"
import { CopyCheck, MoreHorizontal, PenBox, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AlertModal } from "@/components/modals/alert-modal"
import { CategoryColumn } from "@/components/non-reusable/category/columns"
import
{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CellActionProps
{
  data: CategoryColumn
}

export const CellAction = ( {
  data
}: CellActionProps ) =>
{
  const router = useRouter()
  const params = useParams()
  const [ loading, setLoading ] = useState( false )
  const [ open, setOpen ] = useState( false )

  const handleUpdateCategory = () => router.push( `/${ params.storeId }/categories/${ data.id }` )

  const handleDeleteCategory = async () =>
  {
    setLoading( true )
    try
    {
      await axios
        .delete( `/api/${ params.storeId }/categories/${ data.id }` )
        .then( () =>
        {
          toast.success( "Category deleted successfully" )
          router.refresh()
        } )
        .catch( ( error ) => toast.error( `${ error.response.data.message } ${ error.response.data }` ) )
    }
    catch ( error ) { toast.error( "Something went wrong" ) }
    finally 
    {
      setOpen( false )
      setLoading( false )
    }
  }

  const handleCopy = () =>
  {
    navigator.clipboard.writeText( data.id )
    toast.success( "Copied to clipboard" )
  }

  return (
    <>
      <AlertModal
        isOpen={ open }
        onClose={ () => setOpen( false ) }
        onConfirm={ () => handleDeleteCategory() }
        loading={ loading }
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={ () => handleCopy() }>
            <CopyCheck className="w-4 h-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={ () => handleUpdateCategory() }>
            <PenBox className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem className=' text-red-500' onClick={ () => setOpen( true ) }>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
