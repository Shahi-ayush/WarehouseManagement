// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import { Loader2 } from "lucide-react";
// import { useSession } from "next-auth/react";

// export default function CustomerForm() {
//   const { data: session } = useSession();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const [successMsg, setSuccessMsg] = useState("");

//   const onSubmit = async (data) => {
//     setSuccessMsg("");

//     if (!session?.user) {
//       toast.error("You must be logged in to add customers");
//       return;
//     }

//     try {
//       const res = await fetch("/api/customers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast.success("Customer registered successfully!");
//         setSuccessMsg(`✅ ${result.customer.name} has been added.`);
//         reset();
//       } else {
//         toast.error(result.message || "Failed to register customer");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">
//         Register New Customer
//       </h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Full Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             {...register("name", { required: "Name is required" })}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//             placeholder="Enter customer's full name"
//           />
//           {errors.name && (
//             <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
//           )}
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Phone Number <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="tel"
//             {...register("phone", {
//               required: "Phone number is required",
//               pattern: {
//                 value: /^[0-9]{7,15}$/,
//                 message: "Enter a valid phone number",
//               },
//             })}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//             placeholder="e.g. 9800000000"
//           />
//           {errors.phone && (
//             <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//           )}
//         </div>

//         {/* Email
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email (optional)
//           </label>
//           <input
//             type="email"
//             {...register("email")}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//             placeholder="example@email.com"
//           />
//         </div>

    
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Address (optional)
//           </label>
//           <textarea
//             {...register("address")}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//             placeholder="Enter customer address"
//             rows={3}
//           />
//         </div> */}

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full flex justify-center items-center bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200"
//         >
//           {isSubmitting ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin mr-2" />
//               Registering...
//             </>
//           ) : (
//             "Register Customer"
//           )}
//         </button>
//       </form>

//       {successMsg && (
//         <p className="mt-4 text-green-600 text-sm text-center">{successMsg}</p>
//       )}
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Loader2, Link2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomerForm() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (data) => {
    setSuccessMsg("");

    if (!session?.user) {
      toast.error("You must be logged in to add customers");
      return;
    }

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Customer registered successfully!");
        setSuccessMsg(`✅ ${result.customer.name} has been added.`);
        reset();
      } else {
        toast.error(result.message || "Failed to register customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
      {/* New heading and description */}
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Link Customer Account
        </h2>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Enter your email and phone number to link your existing customer account.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter customer's full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{7,15}$/,
                message: "Enter a valid phone number",
              },
            })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 9800000000"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Linking...
            </>
          ) : (
            "Link Customer"
          )}
        </button>
      </form>

      {successMsg && (
        <p className="mt-4 text-green-600 text-sm text-center">{successMsg}</p>
      )}
    </div>
  );
}
