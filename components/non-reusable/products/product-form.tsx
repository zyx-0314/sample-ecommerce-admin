'use client'

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { Trash } from "lucide-react"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { Category, Image, Color, Size, Product } from "@prisma/client"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductFormProps
{
  initialData: Product & {
    images: Image[]
  } | null
  categories: Category[]
  sizes: Size[]
  colors: Color[]
}

const formSchema = z.object( {
  name: z.string().min( 1 ),
  images: z.object( { url: z.string() } ).array(),
  price: z.coerce.number().min( 1 ),
  categoryId: z.string().min( 1 ),
  sizeId: z.string().min( 1 ),
  colorId: z.string().min( 1 ),
  isArchived: z.boolean().default( false ).optional(),
  isFeatured: z.boolean().default( false ).optional(),
} )

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm = ( { initialData, categories, colors, sizes }: ProductFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const title = initialData ? "Edit Product" : "New Product"
  const description = initialData ? "Edit a Product" : "Add a New Product"
  const toastMessage = initialData ? "Product updated successfully" : "Product created successfully"
  const action = initialData ? "Update" : "Create"

  const form = useForm<ProductFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat( initialData?.price.toString() ),
    } : {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      isFeatured: false,
      isArchived: false,
      sizeId: "",
      colorId: "",
    },
  } )

  const handleSubmit = async ( values: ProductFormValues ) =>
  {
    try
    {
      setLoading( true )
      if ( initialData )
      {
        await axios
          .patch( `/api/${ params.storeId }/products/${ params.productsId }`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/products` )
          } )
          .catch( ( error ) => toast.error( error.response.data ) )
          .finally( () => setLoading( false ) )
      }
      else
      {
        await axios
          .post( `/api/${ params.storeId }/products`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            router.push( `/${ params.storeId }/products` )
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
        .delete( `/api/${ params.storeId }/products/${ params.productId }` )
        .then( () =>
        {
          toast.success( "Product deleted successfully" )
          router.refresh()
          router.push( `/${ params.storeId }/products` )
        } )
        .catch( ( error ) => toast.error( error.response.data ) )
    }
    catch ( error ) { toast.error( "Something went wrong" ) }
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
            name="images"
            render={ ( { field } ) =>
            {
              return (
                <FormItem
                >
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={ loading }
                      value={ field.value.map( ( image: any ) => image.url ) }
                      onChange={ ( url ) => field.onChange( [ ...field.value, { url } ] ) }
                      onRemove={ ( url ) => field.onChange( [ ...field.value.filter( ( current ) => current.url !== url ) ] ) }
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
              name="name"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Product Name" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name="price"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Price (PHP)</FormLabel>
                    <FormControl>
                      <Input type="number" disabled={ loading } placeholder="9.99" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name="categoryId"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={ loading } onValueChange={ field.onChange }
                      value={ field.value } defaultValue={ field.value }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={ field.value }
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        { categories.map( ( category ) => (
                          <SelectItem
                            key={ category.id }
                            value={ category.id }
                          >
                            { category.name }
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name="colorId"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Color</FormLabel>
                    <Select
                      disabled={ loading } onValueChange={ field.onChange }
                      value={ field.value } defaultValue={ field.value }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={ field.value }
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        { colors.map( ( color ) => (
                          <SelectItem
                            key={ color.id }
                            value={ color.id }
                          >
                            <div className="flex items-center gap-x-2">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={ { backgroundColor: color.name } }
                              />
                              { color.name }
                            </div>
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name="sizeId"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Size</FormLabel>
                    <Select
                      disabled={ loading } onValueChange={ field.onChange }
                      value={ field.value } defaultValue={ field.value }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={ field.value }
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        { sizes.map( ( size ) => (
                          <SelectItem
                            key={ size.id }
                            value={ size.id }
                          >
                            { size.name } - { size.value }
                          </SelectItem>
                        ) ) }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
            <FormField
              control={ form.control }
              name='isFeatured'
              render={ ( { field } ) =>
              (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={ loading }
                      checked={ field.value }
                      onCheckedChange={ field.onChange }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      Featured products will be displayed on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              ) }
            />
            <FormField
              control={ form.control }
              name='isArchived'
              render={ ( { field } ) =>
              (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      disabled={ loading }
                      checked={ field.value }
                      onCheckedChange={ field.onChange }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archive</FormLabel>
                    <FormDescription>
                      Archived products will not be displayed on the store
                    </FormDescription>
                  </div>
                </FormItem>
              ) }
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
