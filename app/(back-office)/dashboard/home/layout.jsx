import HomeNavbar from '@/components/dashboard/HomeNavbar'
import React from 'react'

export default function Layout({children}) {
  return (
    <div className=''>
        <HomeNavbar></HomeNavbar>
      {children}
    </div>
  )
}
