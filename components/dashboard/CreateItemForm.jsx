"use client"

import FormHeader from '@/components/dashboard/FormHeader'
import SubmitButton from '@/components/FormInputs/SubmitButton'
import TextInput from '@/components/FormInputs/TextInput'
import { Pencil, Plus, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import TextareaInput from '@/components/FormInputs/TextareaInput'
import SelectInput from '@/components/FormInputs/SelectInput'
import { Value } from 'sass'
import { UploadButton, UploadDropzone } from '@/lib/uploadthing'
import Image from 'next/image'
import ImageInput from '@/components/FormInputs/ImageInput'
import { makePostRequest, makePutRequest } from '@/lib/apiRequest'
import { getData } from '@/lib/getData'
import { useRouter } from 'next/navigation'


export default  function CreateItemForm({categories,brands,warehouses,suppliers,initialData={},isUpdate=false}) {

const[imageUrl,setImageUrl]=useState(initialData.imageUrl)
const router= useRouter()
   console.log(categories);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(
    {
       defaultValues:initialData
    }
  )
  const [loading,setLoading]=useState(false);
function redirect(){
router.push("/dashboard/inventory/items")
}
  async function onSubmit(data){
    data.imageUrl=imageUrl
    console.log(data)
    if(isUpdate){
        //update request
                
                  makePutRequest(
                     
                        setLoading,
                        `api/items/${initialData.id}`,
                        data,
                        "Item",
                       redirect,
                        reset
                      )   
    }
 else{
  makePostRequest(
        setLoading,
        "api/items",
        data,
        "Item",
        reset)

        setImageUrl("")
    
 }

   

  }

  return (
 
    <>
     <FormHeader 
      title={isUpdate ? "Update Item" : "New Item"} 
      href="/dashboard/inventory/items" 
    />
    
   
 <form 
      onSubmit={handleSubmit(onSubmit)}
      className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'>
      
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">


          <TextInput label="Item Title" 
name="title" 
register={register} 
errors={errors}
className="w-full"
/>

         <SelectInput name="categoryId"
          label="Select the Item Category" 
          register={register} 
          className='w-full'
          options={Array.isArray(categories) ? categories : []}

          />
        



<TextInput label="Item SKU" 
name="sku" 
register={register} 
errors={errors}
className='w-full'

/>

{/* <TextInput label="Item Barcode" 
name="barcode" 
register={register} 
errors={errors}
//isRequired='false'
className='w-full'

/> */}

<TextInput label="Item Quantity" 
name="quantity" 
register={register} 
errors={errors}
className='w-full'

/>

 {/* <SelectInput name="unitId"
          label="Select the Item Unit" 
          register={register} 
          className='w-full'
          options={Array.isArray(units) ? units : []}

          /> */}

 <SelectInput name="brandId"
          label="Select the Item Brand" 
          register={register} 
          className='w-full'
   options={Array.isArray(brands) ? brands : []}

          />


<TextInput label="Buying Price" 
name="buyingPrice" 
register={register} 
errors={errors}
type='number'
className='w-full'

/>
<TextInput label="Selling Price" 
name="sellingPrice" 
register={register} 
errors={errors}
type='number'
className='w-full'

/>
<SelectInput name="supplierId"
          label="Select the Item Supplier" 
          register={register} 
          className='w-full'
       options={Array.isArray(suppliers) ? suppliers : []}

          />

{/* <TextInput label="Re-Order Point" 
name="reOrderPoint" 
register={register} 
errors={errors}
type='number'
className='w-full'

/> */}

<SelectInput name="warehouseId"
          label="Select the Item Warehouse" 
          register={register} 
          className='w-full'
          options={Array.isArray(warehouses) ? warehouses : []}

          />


{/* <TextInput label="item Weight in Kgs" 
name="weight" 
register={register} 
errors={errors}
type='number'
className='w-full'

/> */}
<TextInput label="Item Dimension in cm(20x30x100)" 
name="dimensions" 
register={register} 
errors={errors}

className='w-full'

/>

{/* <TextInput label="Item Tax Rate in %" 
name="taxRate" 
type='number'
register={register} 
errors={errors}

className='w-full'

/> */}
<TextareaInput label="Item Description" 
name="description" 
register={register} 
errors={errors}
 />
{/* <TextareaInput label="Item Notes" 
name="notes" 
register={register} 
errors={errors}
 /> */}

 <ImageInput label="Item Image"
 imageUrl={imageUrl}
 setImageUrl={setImageUrl}
 endpoint="imageUploader"/>






        </div>
<SubmitButton isLoading={loading} title={isUpdate?"Update Item":"New Item"}/>


      </form>
      </>

  )
}