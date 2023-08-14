"use client"

import * as z from 'zod'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { useStoreModal } from '@/hooks/use-store-modal'
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const formSchema = z.object( {
  name: z.string().nonempty( 'Store name is required' ),
} )

export const StoreModal = () =>
{
  const content = {
    title: 'Create Store',
    description: 'Add a new store to manage',
  }
  const [ loading, setLoading ] = useState( false )

  const storeModal = useStoreModal()
  const form = useForm<z.infer<typeof formSchema>>( {
    resolver: zodResolver( formSchema ),
    defaultValues: {
      name: '',
    },
  } )

  const onSubmit = async ( values: z.infer<typeof formSchema> ) =>
  {
    try
    {
      setLoading( true )
      await axios
        .post( '/api/stores', values )
        .then( ( response ) =>
        {
          toast.success( "Store created successfully" )
          window.location.assign( `/${ response.data.id }` )
        } )
        .catch( ( error ) => toast.error( error.response.data ) )
    }
    catch ( error ) { toast.error( "Something went wrong" ) }
    finally { setLoading( false ) }
  }

  return (
    <Modal
      title={ content.title } description={ content.description }
      isOpen={ storeModal.isOpen } onClose={ storeModal.onClose }
    >
      <div>
        <div className='space-y-4 py-4 pb-4'>
          <Form { ...form }>
            <form onSubmit={ form.handleSubmit( onSubmit ) }>
              <FormField
                control={ form.control } name='name' render={ ( { field } ) => (
                  <FormItem>
                    <FormLabel>
                      E-Commerce Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={ loading } placeholder='E-Commerce' { ...field }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  variant={ "outline" } onClick={ storeModal.onClose } disabled={ loading }
                >
                  Cancel
                </Button>
                <Button
                  disabled={ loading } type='submit'
                >
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}