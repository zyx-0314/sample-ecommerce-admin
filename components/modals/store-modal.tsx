"use client"

import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/use-store-modal'

export const StoreModal = () =>
{
  const content = {
    title: 'Create Store',
    description: 'Add a new store to manage',
  }
  const storeModal = useStoreModal()

  return (
    <Modal
      title={ content.title } description={ content.description }
      isOpen={ storeModal.isOpen } onClose={ storeModal.onClose }
    >
      <div>
        <h1>Create Store Form From here</h1>
      </div>
    </Modal>
  )
}