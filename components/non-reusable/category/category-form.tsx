'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Billboard, Category } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { useOrigin } from "@/hooks/use-origin"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface CategoryFormProps
{
  initialData: Category | null
  billboards: Billboard[]
}

const formSchema = z.object( {
  name: z.string().nonempty( { message: "Category name is required" } ),
  billboardId: z.string().nonempty( { message: "Billboard ID is required" } ),
} )

type CategoryFormValues = z.infer<typeof formSchema>

export const CategoryForm = ( { initialData, billboards }: CategoryFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const title = initialData ? "Edit Category" : "New Category"
  const description = initialData ? "Edit a Category" : "Add a New Category"
  const toastMessage = initialData ? "Category updated successfully" : "Category created successfully"
  const action = initialData ? "Update" : "Create"

  const form = useForm<CategoryFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData || {
      name: "",
      billboardId: '',
    },
  } )

  const handleSubmit = async ( values: CategoryFormValues ) =>
  {
    try
    {
      setLoading( true )
      if ( initialData )
      {
        await axios
          .patch( `/api/${ params.storeId }/categories/${ initialData.id }`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/categories` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () => setLoading( false ) )
      }
      else
      {
        await axios
          .post( `/api/${ params.storeId }/categories`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/categories` )
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
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={ form.control }
              name="name"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Category Name" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name="billboardId"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Billboard</FormLabel>
                    <Select
                      disabled={ loading } onValueChange={ field.onChange }
                      value={ field.value } defaultValue={ field.value }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={ field.value }
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        { billboards.map( ( billboard ) => (
                          <SelectItem
                            key={ billboard.id }
                            value={ billboard.id }
                          >
                            { billboard.label }
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
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
