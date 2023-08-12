"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import { useEffect } from "react"

export default function SetupPage ()
{
  const onOpen = useStoreModal( state => state.onOpen )
  const isOpen = useStoreModal( state => state.isOpen )

  useEffect( () =>
  {
    if ( !isOpen ) onOpen()
  }, [ isOpen, onOpen ] )

  return (
    <section className='p-4'>
      <div className="p-4">
        Root Page
      </div>
    </section>
  )
}
