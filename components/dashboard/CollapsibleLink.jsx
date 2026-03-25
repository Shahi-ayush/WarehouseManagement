

import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CollapsibleLink({href,title}) {
  return (

    <Link className='flex items-center justify-between
    pl-8 pr-4 hover:bg-slate-900
     transition-all duration-800 py-2.5 rounded-md space-x-3'
      href={href}>
        <span className='text-sm'>{title}</span>
        <PlusCircle className='w-4 h-4'/>
        </Link>
  
  )
}
