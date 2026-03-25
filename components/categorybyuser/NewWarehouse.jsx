"use client";

import FormHeader from '@/components/dashboard/FormHeader';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextInput from '@/components/FormInputs/TextInput';
import TextareaInput from '@/components/FormInputs/TextareaInput';
import { useForm } from 'react-hook-form';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SelectInput from '../FormInputs/SelectInput';

export default function NewWarehouse({ initialData = {}, isUpdate = false }) {
  const router = useRouter();

  const selectOptions=[
  {
    title:"Main",
    id:"main"
  },
   {
    title:"Branch",
    id:"branch"
  }
];
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  function redirect() {
    router.push("/dashboard/inventory/warehouse");
  }

  async function onSubmit(data) {
    if (isUpdate) {
      // Update request
      makePutRequest(
        setLoading,
        `api/warehouse/${initialData.id}`,
        data,
        "Warehouse",
        redirect,
        reset
      );
    } else {
      // Create request
      makePostRequest(
        setLoading,
        "api/warehouse",
        data,
        "Warehouse",
        reset
      );
    }
  }

  return (
    <div>
      <FormHeader
        title={isUpdate ? "Update Warehouse" : "New Warehouse"}
        href="/dashboard/inventory/warehouse"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
       
                <SelectInput name="warehouseType"
                 label="Select the Warehouse Type" 
                 register={register} 
                 className='w-full'
                 options={selectOptions}
       
                 />
       
       
       <TextInput label="Warehouse Title" 
       name="title" 
       register={register} 
       errors={errors}
       className="w-full"
       />
       <TextInput label="Warehouse location" 
       name="location" 
       register={register} 
       errors={errors}
       
       />
       
       <TextareaInput label="Warehouse Description" 
       name="description" 
       register={register} 
       errors={errors}
        />
       
        
         
        </div>

        <SubmitButton
          isLoading={loading}
          title={isUpdate ? "Update Warehouse" : "New Warehouse"}
        />
      </form>
    </div>
  );
}
