"use client"

export default function TextareaInput({
    label,
    name,
    register,
    errors,
    isRequired=true,
  
    type="text",
    className="sm:col-span-2",
}) 
    {
        const validationRules = {
          required: isRequired ? `${label} is required` : false,
        };
        // const {register,
        //     formState:{errors}
        // }=useForm ();
  return (
  <div className={className}>
          <label
            htmlFor={name}
            className="block text-sm font-medium leading-6 text-gray-900 mb-2 "
          >
            {label}
          </label>

<div className="mt-2">
            <textarea
              {...register(`${name}`, validationRules)}
                name={name}
              id={name}
              
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              defaultValue={""}
            />
            {errors[`${name}`] && (
              <span className ="text-sm text-red-600 ">
             {errors[`${name}`]?.message || `${label} is required`}
              </span>
            )}
          </div>

        
        </div>

  )
}
