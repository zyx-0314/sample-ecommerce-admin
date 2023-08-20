"use client"

import
{
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ModalProps
{
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const Modal = ( {
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps ) =>
{
  const onChange = ( open: boolean ) =>
  {
    if ( !open )
    {
      onClose()
    }
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ onChange }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ title }</DialogTitle>
          <DialogDescription>
            { description }
          </DialogDescription>
        </DialogHeader>
        <div>
          { children }
        </div>
      </DialogContent>
    </Dialog>
  )
}