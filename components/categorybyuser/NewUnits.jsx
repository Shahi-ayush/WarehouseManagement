"use client";

import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextInput from '@/components/FormInputs/TextInput';
import TextareaInput from '@/components/FormInputs/TextareaInput';
import { useForm } from 'react-hook-form';
import { makePostRequest, makePutRequest } from '@/lib/apiRequest';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewUnit({ initialData = {}, isUpdate = false, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  function redirect() {
    router.push("/dashboard/inventory/units");
  }

  async function onSubmit(data) {
    if (isUpdate) {
      // Update request
      makePutRequest(
        setLoading,
        `api/units/${initialData.id}`,
        data,
        "Units",
        redirect,
        reset
      );
    } else {
      // Create request
      makePostRequest(
        setLoading,
        "api/units",
        data,
        "Unit",
        reset,
        onSuccess
      );
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700'
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Unit Title" 
          name="title" 
          register={register} 
          errors={errors}
          className="w-full"
          />
          
          <TextInput label="Unit Abbreviation" 
          name="abbreviation" 
          register={register} 
          errors={errors}
          className="w-full"
          />
        </div>

        <SubmitButton
          isLoading={loading}
          title={isUpdate ? "Update Unit" : "New Unit"}
        />
      </form>
    </div>
  );
}
