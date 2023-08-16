'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Size } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
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

interface SizeFormProps
{
  initialData: Size | null
}

const formSchema = z.object( {
  name: z.string().min( 1 ),
  value: z.string().min( 1 ),
} )

type SizeFormValues = z.infer<typeof formSchema>

export const SizeForm = ( { initialData }: SizeFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const title = initialData ? "Edit Size" : "New Size"
  const description = initialData ? "Edit a Size" : "Add a New Size"
  const toastMessage = initialData ? "Size updated successfully" : "Size created successfully"
  const action = initialData ? "Update" : "Create"

  const form = useForm<SizeFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  } )

  const handleSubmit = async ( values: SizeFormValues ) =>
  {
    try
    {
      setLoading( true )
      if ( initialData )
      {
        await axios
          .patch( `/api/${ params.storeId }/sizes/${ params.sizesId }`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/sizes` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () => setLoading( false ) )
      }
      else
      {
        await axios
          .post( `/api/${ params.storeId }/sizes`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/sizes` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () => setLoading( false ) )
      }

    }
    catch ( error ) { toast.error( "Something went wrong" ) }
  }

  const handleDelete = async () =>
  {
    try
    {
      setLoading( true )
      await axios
        .delete( `/api/${ params.storeId }/sizes/${ params.sizesId }` )
        .then( () =>
        {
          toast.success( "Billboard deleted successfully" )
          router.refresh()
          router.push( `/${ params.storeId }/sizes` )
        } )
        .catch( ( error ) => toast.error( error.response.data ) )
    }
    catch ( error ) { toast.error( "Can't Delete" ) }
    finally
    {
      setLoading( false )
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
          title={ title }
          description={ description }
        />
        { initialData && (
          <Button
            disabled={ loading }
            variant='destructive'
            size='icon'
            onClick={ () => setOpen( true ) }
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) }
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
                    <FormLabel>Size Name</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Size Name" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name="value"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="ex. 1234567890" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
          </div>
          <Button disabled={ loading } className="ml-auto" type="submit">
            { action }
          </Button>
          <Separator />
        </form>
      </Form>
    </>
  )
}
