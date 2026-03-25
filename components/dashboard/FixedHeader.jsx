import { HelpCircle, LayoutGrid, List, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function FixedHeader({newLink,title}) {
  return (
    <div className='flex justify-between items-center bg-white-200 py-6 px-4'>
      <button className='text-2xl'>{title}</button>
      <div className="flex gap-4">
        
        {/* New */}
<div className="pr-2 border-r border-gray-300">
        <Link href={newLink}
        className='p-1 bg-blue-600 px-3 text-white rounded-sm
        flex items-center space-x-2 '>
          <Plus className=' w-4 h-4  '/>
           
          <span>New</span>
          
          </Link>
</div>

          {/* Layout */}
          <div className="flex rounded-md overflow-hidden">
            <button className='bg-gray-200 p-2 border-r border-gray-400 '>
                <List className='w-4 h-4 '/>
            </button>
            <button className='bg-gray-100 p-2  '>
                <LayoutGrid className='w-4 h-4'/>
            </button>
          </div>
            {/* More */}
            <button className='bg-gray-100 p-2'>
               <MoreHorizontal className='w-4 h-4'/> 
            </button>
              {/* Help */}
              <button className='bg-orange-600 p-2 rounded-md'>
               <HelpCircle className='w-5 h-5 text-white '/>
            </button>
      </div>
    </div>
  )
}
