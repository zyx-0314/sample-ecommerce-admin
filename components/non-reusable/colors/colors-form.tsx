'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Color } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
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

interface ColorFormProps
{
  initialData: Color | null
}

const formSchema = z.object( {
  name: z.string().min( 1 ),
  value: z.string().min( 4 ).regex( /^#/, {
    message: 'String must be a valid hex color code'
  } ),
} )

type ColorFormValues = z.infer<typeof formSchema>

export const ColorForm = ( { initialData }: ColorFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const [ another, setAnother ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const title = initialData ? "Edit Color" : "New Color"
  const description = initialData ? "Edit a Color" : "Add a New Color"
  const toastMessage = initialData ? "Color updated successfully" : "Color created successfully"
  const action = initialData ? "Update" : "Create"
  const secondaryAction = initialData ? "Add New Color" : "Submit Another"

  const form = useForm<ColorFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  } )

  const handleSubmit = async ( values: ColorFormValues ) =>
  {
    values.value = values.value.toUpperCase()
    try
    {
      setLoading( true )
      if ( initialData )
      {
        await axios
          .patch( `/api/${ params.storeId }/colors/${ params.colorId }`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            if ( another ) router.push( `/${ params.storeId }/colors/new` )
            else router.push( `/${ params.storeId }/colors` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () =>
          {
            setLoading( false )
            setAnother( false )
            if ( another ) window.location.reload();
          } )
      }
      else
      {
        await axios
          .post( `/api/${ params.storeId }/colors`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            if ( another ) router.push( `/${ params.storeId }/colors/new` )
            else router.push( `/${ params.storeId }/colors` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () =>
          {
            setLoading( false )
            setAnother( false )
            if ( another ) window.location.reload();

          } )
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
        .delete( `/api/${ params.storeId }/colors/${ params.colorId }` )
        .then( () =>
        {
          toast.success( "Billboard deleted successfully" )
          router.refresh()
          router.push( `/${ params.storeId }/colors` )
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
                    <FormLabel>Color Name</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Black" { ...field } />
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
                      <div className="flex items-center gap-x-4">
                        <Input disabled={ loading }  { ...field } placeholder="#0000" />
                        <Input disabled={ loading } type="color" { ...field } className="border-slate-800 w-[2.5rem] p-1 m-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
          </div>
          <div className="justify-end w-full flex">
            <div className="flex gap-x-2">
              <Button
                disabled={ loading }
                variant='secondary'
                type="submit"
                onClick={ () => setAnother( true ) }
              >
                { secondaryAction }
              </Button>
              <Button disabled={ loading } type="submit">
                { action }
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
