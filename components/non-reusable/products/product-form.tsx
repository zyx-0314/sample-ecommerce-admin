'use client'

import * as z from "zod"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { CheckSquare, Square, Trash } from "lucide-react"
import { Category, Image, Color, Product } from "@prisma/client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ImageUpload } from "@/components/ui/image-upload"
import { AlertModal } from "@/components/modals/alert-modal"
import FacetSelection from "@/components/ui/facet-selection"
import
{
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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

interface ProductFormProps
{
  initialData: Product & {
    images: Image[]
  } | null
  categories: Category[]
  colors: Color[]
  duplicate?: boolean
}

const formSchema = z.object( {
  name: z.string().min( 1 ),
  images: z.object( { url: z.string() } ).array(),
  price: z.coerce.number().min( 1 ),
  categoryId: z.string().min( 1 ),
  color: z.string().default( ' ' ),
  size: z.string().default( ' ' ),
  subName: z.string().default( ' ' ).optional().nullable(),
  isArchived: z.boolean().default( false ).optional(),
  isFeatured: z.boolean().default( false ).optional(),
  stock: z.coerce.number().min( 1 ),
  details: z.string().max( 5000 ).default( ' ' ).optional(),
} )

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm = ( { initialData, categories, colors, duplicate }: ProductFormProps ) =>
{
  const [ open, setOpen ] = useState( false )
  const [ loading, setLoading ] = useState( false )
  const [ selectedColorsIdValue, setSelectedColorsIdValue ] = useState<{ id: string, value: string }[]>( [] )
  const [ another, setAnother ] = useState( false )
  const params = useParams()
  const router = useRouter()
  const title = initialData
    ? duplicate
      ? "Duplicate Product"
      : "Edit Product"
    : "New Product"
  const description = initialData && !duplicate
    ? "Edit a Product"
    : "Add a New Product"
  const toastMessage = initialData && !duplicate ? "Product updated successfully" : "Product created successfully"
  const action = initialData && !duplicate ? "Update" : "Create"
  const secondaryAction = initialData ? "Add New Color" : "Submit Another"

  // Check if there is existing category/ies, color/s to select from
  useEffect( () =>
  {
    if ( categories.length === 0 || colors.length === 0 )
    {
      const missing = categories.length === 0 ? 'Categories' : 'Colors'
      router.push( `/${ params.storeId }/${ missing.toLocaleLowerCase() }` )
      router.refresh()
      toast.error( `No ${ missing } Yet` )
    }

  }, [ categories ] )

  // convert color id to color value
  useEffect( () =>
  {
    setSelectedColorsIdValue( initialData?.color?.split( ',' ).map( ( color ) =>
    {
      const value = colors.find( ( { id } ) => id === color )?.value
      return { id: color, value: value || color }
    } ) || [] )
  }, [ initialData ] )

  const form = useForm<ProductFormValues>( {
    resolver: zodResolver( formSchema ),
    defaultValues: initialData
      ? {
        ...initialData,
        price: parseFloat( initialData?.price.toString() ),
      }
      : {
        subName: "",
        name: "",
        images: [],
        price: 0.00,
        categoryId: "",
        isFeatured: false,
        isArchived: false,
        // sizeId: "",
        // colorId: "",
        stock: 0,
      },
  } )

  const handleSubmit = async ( values: ProductFormValues ) =>
  {
    values.color = selectedColorsIdValue.map( ( { id } ) => id ).join( ',' )

    try
    {
      setLoading( true )
      if ( initialData && !duplicate )
      {
        await axios
          .patch( `/api/${ params.storeId }/products/${ params.productsId }`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            if ( another ) router.push( `/${ params.storeId }/products/new` )
            else router.push( `/${ params.storeId }/products` )
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
          .post( `/api/${ params.storeId }/products`, values )
          .then( () =>
          {
            toast.success( toastMessage )
            router.refresh()
            if ( another ) router.push( `/${ params.storeId }/products/new` )
            else router.push( `/${ params.storeId }/products` )
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

  const handleSelectedColorId = ( value: string, colorId: string ) =>
  {
    if ( value === 'reset' )
      setSelectedColorsIdValue( [] )
    else if ( selectedColorsIdValue.find( ( { id } ) => id === colorId ) )
      setSelectedColorsIdValue( selectedColorsIdValue.filter( ( { id } ) => id !== colorId ) )
    else
      setSelectedColorsIdValue( [ ...selectedColorsIdValue, { id: colorId, value } ] )
  }

  return (
    <>
      {/* Alert Modal */ }
      <AlertModal
        isOpen={ open }
        onClose={ () => setOpen( false ) }
        onConfirm={ handleDelete }
        loading={ loading }
      />

      {/* Section Page Header */ }
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
          {/* Image Input */ }
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

          <div className="grid grid-cols-3 gap-8 sm:grid-cols-2">
            {/* Product Name - Text Input */ }
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

            {/* Product SubName - Text Input */ }
            <FormField
              control={ form.control }
              name="subName"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Product Sub-Name</FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="Product Name" value={ field.value ? field.value : '' } onChange={ ( e ) => field.onChange( e.target.value ) } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
          </div>

          <div className="grid grid-cols-4 gap-8 sm:grid-cols-3">
            {/* Product Category - Select Input */ }
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
                            placeholder="Select a Category"
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

            {/* Product Color tags - Check Box */ }
            <FormField
              control={ form.control }
              name="color"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <FacetSelection
                        data={ colors }
                        selectedData={ selectedColorsIdValue }
                        onChange={ handleSelectedColorId }
                        disable={ loading }
                        isColor
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />

            {/* Product Size -Text Area */ }
            <FormField
              control={ form.control }
              name="size"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Size <span className="italic font-thin text-xs">use , as seperations</span></FormLabel>
                    <FormControl>
                      <Input disabled={ loading } placeholder="S, M, L, XL" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
          </div>

          <div className="grid grid-cols-1">
            {/* Product Description - Text Area */ }
            <FormField
              control={ form.control }
              name="details"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <>
                        <Textarea
                          placeholder="Product Description"
                          id="description"
                          value={ field.value || '' }
                          onChange={ ( e ) =>
                          {
                            if ( e.target.value.length <= 5000 )
                              field.onChange( e.target.value )
                          }
                          }
                          disabled={ loading }
                        />
                        <p className="text-sm text-muted-foreground">
                          A Short Description of product with max 5000 characters. { field.value?.length || 0 } / 5000
                        </p>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />
          </div>

          <div className="grid grid-cols-4 gap-8 sm:grid-cols-3">
            {/* Product Price - Number Input */ }
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
                      <Input type="number" disabled={ loading } placeholder="9.99" { ...field } step='.25' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />

            {/* Product Stock - Number Input */ }
            <FormField
              control={ form.control }
              name="stock"
              render={ ( { field } ) =>
              {
                return (
                  <FormItem
                  >
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" disabled={ loading } placeholder="10" { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              } }
            />

          </div>

          <div className="grid grid-cols-4 gap-8 sm:grid-cols-3">
            {/* Featured Checkbox */ }
            <FormField
              control={ form.control }
              name='isFeatured'
              render={ ( { field } ) =>
              (
                <FormItem
                  className={ `flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 transition-all ${ loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-900' }` }
                  onClick={ () =>
                  {
                    if ( !loading )
                      field.onChange( !field.value )
                  } }
                >
                  <FormControl>
                    { field.value
                      ? <CheckSquare className="h-6 w-6" />
                      : <Square className="h-6 w-6" />
                    }
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

            {/* Archive Checkbox */ }
            <FormField
              control={ form.control }
              name='isArchived'
              render={ ( { field } ) =>
              (
                <FormItem
                  className={ `flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 transition-all ${ loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-900' }` }
                  onClick={ () =>
                  {
                    if ( !loading )
                      field.onChange( !field.value )
                  } }
                >
                  <FormControl>
                    { field.value
                      ? <CheckSquare className="h-6 w-6" />
                      : <Square className="h-6 w-6" />
                    }
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

          <div className="w-full flex flex-row items-center justify-end space-x-4">
            <div className="flex gap-x-2">
              <Button
                disabled={ loading }
                variant='secondary'
                type="submit"
                onClick={ () => setAnother( true ) }
              >
                { secondaryAction }
              </Button>
              <Button disabled={ loading } className="ml-auto" type="submit">
                { action }
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}
