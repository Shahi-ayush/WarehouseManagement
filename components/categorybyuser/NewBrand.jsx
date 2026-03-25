"use client";

import FormHeader from '@/components/dashboard/FormHeader';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextInput from '@/components/FormInputs/TextInput';
import TextareaInput from '@/components/FormInputs/TextareaInput';
import { useForm } from 'react-hook-form';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewBrand({ initialData = {}, isUpdate = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  function redirect() {
    router.push("/dashboard/inventory/brands");
  }

  async function onSubmit(data) {
    if (isUpdate) {
      // Update request
      makePutRequest(
        setLoading,
        `api/brands/${initialData.id}`,
        data,
        "Brands",
        redirect,
        reset
      );
    } else {
      // Create request
      makePostRequest(
        setLoading,
        "api/brands",
        data,
        "Brands",
        reset
      );
    }
  }

  return (
    <div>
      <FormHeader
        title={isUpdate ? "Update Brand" : "New Brand"}
        href="/dashboard/inventory/brands"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
         <TextInput label="Brand Title" 
         name="title" 
         register={register} 
         errors={errors}
         className="w-full"
         />
         
        </div>

        <SubmitButton
          isLoading={loading}
          title={isUpdate ? "Update Brand" : "New Brand"}
        />
      </form>
    </div>
  );
}
