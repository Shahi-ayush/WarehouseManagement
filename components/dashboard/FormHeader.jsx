import { X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function FormHeader({title,href}) {
  return (
    <div className="py-3 px-16 flex items-center justify-between bg-white">
        <h2 className='text-2xl font-semibold'>{title}</h2>
        <a href={href}>
        <X/>
        </a>
      </div>
  )
}
