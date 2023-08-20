'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Billboard } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ui/image-upload"
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

interface BillboardFormProps
{
  initialData: Billboard | null
}

const formSchema = z.object( {
  label: z.string().min( 1 ),
  imageUrl: z.string().url().min( 1 ),
} )

type BillboardFormValues = z.infer<typeof formSchema>

export const BillboardForm = ( { initialData }: BillboardFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const title = initialData ? "Edit Billboard" : "New Billboard"
  const description = initialData ? "Edit a Billboard" : "Add a New Billboard"
  const toastMessage = initialData ? "Billboard updated successfully" : "Billboard created successfully"
  const action = initialData ? "Update" : "Create"

  const form = useForm<BillboardFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  } )

  const handleSubmit = async ( values: BillboardFormValues ) =>
  {
    try
    {
      setLoading( true )
      if ( initialData )
      {
        await axios
          .patch( `/api/${ params.storeId }/billboards/${ params.billboardId }`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/billboards` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () => setLoading( false ) )
      }
      else
      {
        await axios
          .post( `/api/${ params.storeId }/billboards`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/billboards` )
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
        .delete( `/api/${ params.storeId }/billboards/${ params.billboardId }` )
        .then( () =>
        {
          toast.success( "Billboard deleted successfully" )
          router.refresh()
          router.push( `/${ params.storeId }/billboards` )
        } )
        .catch( ( error ) => toast.error( error.response.data ) )
    }
    catch ( error ) { toast.error( "Make sure you disable/remove all categories using this bllboard first" ) }
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
          <FormField
            control={ form.control }
            name="imageUrl"
            render={ ( { field } ) =>
            {
              return (
                <FormItem
                >
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={ loading }
                      value={ field.value ? [ field.value ] : [] }
                      onChange={ ( url ) => field.onChange( url ) }
                      onRemove={ () => field.onChange( "" ) }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            } }
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={ form.control }
              name="label"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Billboard Label</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Billboard Label" { ...field } />
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
