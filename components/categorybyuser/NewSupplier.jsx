"use client";

import FormHeader from '@/components/dashboard/FormHeader';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextInput from '@/components/FormInputs/TextInput';
import TextareaInput from '@/components/FormInputs/TextareaInput';
import { useForm } from 'react-hook-form';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewSupplier({ initialData = {}, isUpdate = false }) {
  
  
  
    const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  function redirect() {
    router.push("/dashboard/inventory/suppliers");
  }

  async function onSubmit(data) {
    if (isUpdate) {
      // Update request
      makePutRequest(
        setLoading,
        `api/suppliers/${initialData.id}`,
        data,
        "Suppliers",
        redirect,
        reset
      );
    } else {
      // Create request
      makePostRequest(
        setLoading,
        "api/suppliers",
        data,
        "Suppliers",
        reset
      );
    }
  }

  return (
    <div>
      <FormHeader
        title={isUpdate ? "Update Existing Supplier" : "Create A New Supplier"}
        href="/dashboard/inventory/suppliers"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'
      >
     
 <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

       
<TextInput label="Suppliers Name" 
name="title" 
register={register} 
errors={errors}
className="w-full"
/>
<TextInput label="Suppliers Phone" 
name="phone" 
register={register} 
errors={errors}
className="w-full"

/>
<TextInput label="Suppliers email" 
name="email" 
type='email'
register={register} 
errors={errors}
className="w-full"

/>
<TextInput label="Suppliers Address" 
name="address" 
register={register} 
errors={errors}
className="w-full"

/>
{/* <TextInput label="Suppliers Contact Person" 
name="contactPerson" 
register={register} 
errors={errors}
className="w-full"
/> */}

<TextInput label="Suppliers Code" 
name="supplierCode" 
register={register} 
errors={errors}
className="w-full"
/>

{/* <TextInput label="Suppliers TIN" 
name="taxID" 
register={register} 
errors={errors}

/> */}

<TextInput label="Suppliers Payment Terms" 
name="paymentTerms" 
register={register} 
errors={errors}
className="w-full"
/>

<TextInput label="Notes" 
name="notes" 
register={register} 
errors={errors}

/>


        </div>



        <SubmitButton
          isLoading={loading}
          title={isUpdate ? "Update Category" : "New Category"}
        />
      </form>
    </div>
  );
}
