'use client'
import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'


interface errorProps
{
  error: Error
  reset: () => void
}

const error = ( { error, reset }: errorProps ) =>
{

  return (
    <main className="grid min-h-full place-items-center px-6 py24 sm:py-32 lg:px-8 bg-gray-900">
      <div className="text-center">
        <p className="text-base font-semibold text-green-700 dark:text-green-500">
          There was a problem
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-black-900 dark:text-white sm:text-4xl">
          { error.message || 'Something went wrong' }
        </h1>
        <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Plese try again later or contact support.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button onClick={ reset } className='rounded border-2 border-green-500 bg-gree-200 px-5 py-3'>Try Again</button>
          <Link href='/' >Go back Home</Link>
        </div>
      </div>
    </main>
  )
}

error.propTypes = {
  error: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired
}

export default error