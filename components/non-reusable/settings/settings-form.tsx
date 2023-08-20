'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { Trash } from "lucide-react"
import { Store } from "@prisma/client"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { ApiAlert } from "@/components/ui/api-alert"
import { Separator } from "@/components/ui/separator"
import { AlertModal } from "@/components/modals/alert-modal"
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

interface SettingsFormProps
{
  initialData: Store
}

const formSchema = z.object( {
  name: z.string().min( 1 )
} )

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm = ( { initialData }: SettingsFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const { origin } = useOrigin()

  const form = useForm<SettingsFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData,
  } )

  const handleSubmit = async ( values: SettingsFormValues ) =>
  {
    try
    {
      setLoading( true )

      await axios
        .patch( `/api/stores/${ params.storeId }`, values )
        .then( () =>
        {
          toast.success( "Store updated successfully" )
          router.refresh()
        } )
        .catch( ( error ) => toast.error( error.response.data ) )
    }
    catch ( error ) { toast.error( "Something went wrong" ) }
    finally { setLoading( false ) }
  }

  const handleDelete = async () =>
  {
    try
    {
      setLoading( true )
      await axios
        .delete( `/api/stores/${ params.storeId }` )
        .then( () =>
        {
          toast.success( "Store deleted successfully" )
          router.refresh()
          router.push( "/" )
        } )
        .catch( ( error ) => toast.error( error.response.data ) )
    }
    catch ( error ) { toast.error( "Make sure you disable/remove all  products and all categories first" ) }
    finally
    {
      setOpen( false )
    }
  }


  return (
    <>
      <AlertModal
        isOpen={ open }
        onClose={ () => setOpen( false ) }
        onConfirm={ handleDelete }
        loading={ loading }
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage your store settings"
        />
        <Button
          disabled={ loading }
          variant='destructive'
          size='icon'
          onClick={ () => setOpen( true ) }
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit( handleSubmit ) } className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={ form.control }
              name="name"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Store Name</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Store Name" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
          </div>
          <Button disabled={ loading } className="ml-auto" type="submit">
            Save Changes
          </Button>
          <Separator />
          <ApiAlert title="NEXT_PUBLIC_API_URL" description={ `${ origin }/api/${ params.storeId }` } variant='public' />
        </form>
      </Form>
    </>
  )
}
