"use client"
import FixedHeader from '@/components/dashboard/FixedHeader';
import OptionCard from '@/components/dashboard/OptionCard';
import { Award, Bitcoin, Boxes, Combine, Component, CopyPlus, Factory, Home, HousePlus, Plus, Puzzle, ScrollText, ScrollTextIcon, Shirt, ShoppingCart, Warehouse } from 'lucide-react';
import Link from 'next/link';

export default function Inventory() {
  
 const optionCards = [

   {
    title:"Items",
    description:"Create standalone items and services that you buy and sell",
  link:"/dashboard/inventory/items/new",
  linkTitle:"New Item",
  enabled:true,
  icon: Puzzle,
  
  },
 {
    title:"Categories",
    description:"Bundle different items together and sell them as a kits",
  link:"/dashboard/inventory/categories/new",
  linkTitle:"New Category",
  enabled:true,
   icon: Boxes,
  
  
  },

   {
    title:"Brands",
    description:"Tweak your item prices for specific contacts or transactions",
  link:"/dashboard/inventory/brands/new",
  linkTitle:"New Brand",
  enabled:true,
  icon: Bitcoin,
  
  },
  {
    title:"Warehouse",
    description:"Tweak your item prices for specific contacts or transactions",
  link:"/dashboard/inventory/warehouse/new",
  linkTitle:"New Warehouse",
  enabled:true,
  icon: Warehouse,
  
  },
  // {
  //   title:"Units",
  //   description:"Tweak your item prices for specific contacts or transactions",
  // link:"/dashboard/inventory/units/new",
  // linkTitle:"New Unit",
  // enabled:true,
  // icon: Combine,
  
  // },

    {
    title:"Suppliers",
    description:"Tweak your item prices for specific contacts or transactions",
  link:"/dashboard/inventory/suppliers/new",
  linkTitle:"New Supplier",
  enabled:true,
  icon: Factory,
  
  },

   {
    title:"Inventory Adjustments",
    description:"Transfer stock from Main warehouse",
  link:"/dashboard/inventory/adjustments/new",
  linkTitle:"New Adjustment",
  enabled:true,
  icon: CopyPlus,
  
  },


 ];
  return (
  
     <div className="grid grid-col-1 lg:grid-cols-3 md:grid-cols-2 py-8 px-16 gap-5">


{
  optionCards.map((card,i)=>{
    return(
      <OptionCard optionData={card} key={i}/>
    )
  })
}


      </div>
   
  );
}
