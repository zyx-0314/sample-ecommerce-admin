"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Modal } from '@/components/ui/modal'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStoreModal } from '@/hooks/use-store-modal'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'

const formSchema = z.object( {
  name: z.string().nonempty( 'Store name is required' ),
} )

export const StoreModal = () =>
{
  const content = {
    title: 'Create Store',
    description: 'Add a new store to manage',
  }
  const storeModal = useStoreModal()
  const form = useForm<z.infer<typeof formSchema>>( {
    resolver: zodResolver( formSchema ),
    defaultValues: {
      name: '',
    },
  } )

  const onSubmit = async ( values: z.infer<typeof formSchema> ) =>
  {
    console.log( values )
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
                      <Input placeholder='E-Commerce' { ...field } />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ) }
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant={ "outline" } onClick={ storeModal.onClose }>Cancel</Button>
                <Button type='submit'>Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}