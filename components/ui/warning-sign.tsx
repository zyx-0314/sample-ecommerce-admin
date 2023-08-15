import { AlertCircle, AlertOctagon, AlertTriangle } from "lucide-react"

interface WarningSignProps
{
  content: string
  variant?: 'Future' | 'Info' | 'Underworks'

}

export const WarningSign = ( {
  content,
  variant = 'Info'
}: WarningSignProps ) =>
{
  let color: string = 'bg-black-100 border-black-500'
  let logo

  if ( variant === 'Future' )
  {
    color = 'bg-red-100 border-red-500'
    logo = <AlertTriangle className='w-8 h-8 text-red-500' />
  }
  else if ( variant === 'Info' )
  {
    color = 'bg-blue-100 border-blue-500'
    logo = <AlertOctagon className='w-8 h-8 text-blue-500' />
  }
  else if ( variant === 'Underworks' )
  {
    color = 'bg-orange-100 border-orange-500'
    logo = <AlertCircle className='w-8 h-8 text-orange-500' />
  }




  return (
    <div className="w-full flex justify-center p-4">
      <div className={ `border-2 rounded p-4 flex gap-2 w-fit items-center ${ color }` }>
        { logo }
        <span className='font-bold'>
          { content }
        </span>
      </div>
    </div>
  )
}
