// "use client";

// import { Suspense, useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
// import { Loader2, Link2, Trash2 } from "lucide-react";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";

// function CustomersPageContent() {
//   const { data: session } = useSession();
//   const searchParams = useSearchParams();
//   const prefillPhone = searchParams.get("phone") || "";

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm();

//   const [successMsg, setSuccessMsg] = useState("");
//   const [customers, setCustomers] = useState([]);
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [matchedCustomer, setMatchedCustomer] = useState(null);
//   const phoneValue = watch("phone");

//   const findCustomerByPhone = useCallback((phone) => {
//     const normalizedPhone = phone?.trim();
//     if (!normalizedPhone) return null;

//     const accountMatch = accounts.find((account) => account.phone === normalizedPhone);
//     return (
//       accountMatch?.customer ||
//       customers.find((customer) => customer.phone === normalizedPhone) ||
//       null
//     );
//   }, [accounts, customers]);

//   useEffect(() => {
//     if (prefillPhone) {
//       setValue("phone", prefillPhone);
//     }
//   }, [prefillPhone, setValue]);

//   useEffect(() => {
//     const phone = phoneValue?.trim();
//     if (!phone) {
//       setMatchedCustomer(null);
//       setValue("name", "");
//       return;
//     }

//     const customerMatch = findCustomerByPhone(phone);

//     setMatchedCustomer(customerMatch || null);

//     if (customerMatch?.name) {
//       setValue("name", customerMatch.name, {
//         shouldDirty: true,
//         shouldValidate: true,
//       });
//     } else {
//       setValue("name", "");
//     }
//   }, [findCustomerByPhone, phoneValue, setValue]);

//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         const accountsRes = await fetch("/api/customer-auth/customer-accounts");
//         const accountsData = await accountsRes.json();
//         setAccounts(accountsData.accounts || []);

//         const customersRes = await fetch("/api/customers");
//         const customersData = await customersRes.json();
//         setCustomers(customersData.customers || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load customers/accounts");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, []);

//   const onSubmit = async (data) => {
//     setSuccessMsg("");

//     if (!session?.user) {
//       toast.error("You must be logged in to add customers");
//       return;
//     }

//     const accountExists = accounts.some((account) => account.phone === data.phone);
//     const matched = findCustomerByPhone(data.phone);
//     const customerName = matched?.name || "";

//     if (!accountExists) {
//       toast.error("Phone number not registered");
//       return;
//     }

//     if (!customerName) {
//       toast.error("Customer name not found for this phone number");
//       return;
//     }

//     try {
//       const res = await fetch("/api/customers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, name: customerName }),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast.success("Customer registered successfully!");
//         setSuccessMsg(`${result.customer.name} has been added.`);
//         reset();
//         setCustomers((previous) => [...previous, result.customer]);
//       } else {
//         toast.error(result.message || "Failed to register customer");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this customer?")) return;

//     try {
//       const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });

//       if (res.ok) {
//         toast.success("Customer deleted successfully!");
//         setCustomers((previous) => previous.filter((customer) => customer.id !== id));
//       } else {
//         const data = await res.json();
//         toast.error(data.message || "Failed to delete customer");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white shadow-md rounded-xl p-8 mb-8">
//         <div className="flex items-center gap-2 mb-4">
//           <Link2 className="w-5 h-5 text-blue-600" />
//           <h2 className="text-2xl font-semibold text-gray-800">
//             Search For Registered Customer
//           </h2>
//         </div>
//         <p className="text-gray-500 text-sm mb-6">
//           Enter a registered phone number to find the customer.
//         </p>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="tel"
//               {...register("phone", {
//                 required: "Phone number is required",
//                 pattern: {
//                   value: /^[0-9]{7,15}$/,
//                   message: "Enter a valid phone number",
//                 },
//               })}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               placeholder="e.g. 9800000000"
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Customers Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               {...register("name")}
//               readOnly
//               className="w-full cursor-not-allowed border border-gray-300 rounded-md bg-gray-100 px-3 py-2 text-gray-700 outline-none"
//               placeholder="Customer name appears automatically"
//             />
//             {matchedCustomer?.name && (
//               <p className="text-green-600 text-sm mt-1">
//                 Matched customer: {matchedCustomer.name}
//               </p>
//             )}
//             {phoneValue && !matchedCustomer?.name && (
//               <p className="text-gray-500 text-sm mt-1">
//                 No customer name found for this phone number.
//               </p>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full flex justify-center items-center bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 transition-all duration-200"
//           >
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin mr-2" />
//                 Linking...
//               </>
//             ) : (
//               "Search For Registered Customer"
//             )}
//           </button>
//         </form>

//         {successMsg && (
//           <p className="mt-4 text-green-600 text-sm text-center">{successMsg}</p>
//         )}
//       </div>

//       <div className="bg-white shadow-md rounded-xl p-6">
//         <h1 className="text-2xl font-bold mb-4">Customer List</h1>
//         {loading ? (
//           <div className="flex justify-center items-center h-32">
//             <Loader2 className="animate-spin text-blue-600" size={48} />
//           </div>
//         ) : customers.length === 0 ? (
//           <p>No customers found.</p>
//         ) : (
//           <table className="w-full border-collapse border">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="border p-2 text-left">Name</th>
//                 <th className="border p-2 text-left">Phone</th>
//                 <th className="border p-2 text-left">Email</th>
//                 <th className="border p-2 text-left">Created At</th>
//                 <th className="border p-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {customers.map((customer) => (
//                 <tr key={customer.id} className="hover:bg-gray-100">
//                   <td className="border p-2">{customer.name}</td>
//                   <td className="border p-2">{customer.phone}</td>
//                   <td className="border p-2">{customer.email}</td>
//                   <td className="border p-2">
//                     {new Date(customer.createdAt).toLocaleString()}
//                   </td>
//                   <td className="border p-2 flex gap-2">
//                     <Link
//                       href={`/dashboard/purchases/customers/${customer.id}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       View
//                     </Link>
//                     <button
//                       onClick={() => handleDelete(customer.id)}
//                       className="flex items-center text-red-600 hover:underline"
//                     >
//                       <Trash2 className="w-4 h-4 mr-1" /> Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// function LoadingFallback() {
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white shadow-md rounded-xl p-8 text-center text-gray-500">
//         Loading customer tools...
//       </div>
//     </div>
//   );
// }

// export default function CustomersPage() {
//   return (
//     <Suspense fallback={<LoadingFallback />}>
//       <CustomersPageContent />
//     </Suspense>
//   );
// }









"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Loader2, Link2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function CustomersPageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const prefillPhone = searchParams.get("phone") || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const [successMsg, setSuccessMsg] = useState("");
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (prefillPhone) {
      setValue("phone", prefillPhone);
    }
  }, [prefillPhone, setValue]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const accountsRes = await fetch("/api/customer-auth/customer-accounts");
        const accountsData = await accountsRes.json();
        setAccounts(accountsData.accounts || []);

        const customersRes = await fetch("/api/customers");
        const customersData = await customersRes.json();
        setCustomers(customersData.customers || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load customers/accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const onSubmit = async (data) => {
    setSuccessMsg("");

    if (!session?.user) {
      toast.error("You must be logged in to add customers");
      return;
    }

    const accountExists = accounts.some((account) => account.phone === data.phone);

    if (!accountExists) {
      toast.error("Phone number not registered");
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
        setSuccessMsg(`${result.customer.name} has been added.`);
        reset();
        setCustomers((previous) => [...previous, result.customer]);
      } else {
        toast.error(result.message || "Failed to register customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });

      if (res.ok) {
        toast.success("Customer deleted successfully!");
        setCustomers((previous) => previous.filter((customer) => customer.id !== id));
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete customer");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-8 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Search For Registered Customer
          </h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Enter a registered phone number to find the customer.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customers Name <span className="text-red-500">*</span>
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
              "Search For Registered Customer"
            )}
          </button>
        </form>

        {successMsg && (
          <p className="mt-4 text-green-600 text-sm text-center">{successMsg}</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Customer List</h1>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : customers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <table className="w-full border-collapse border">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Phone</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Created At</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-100">
                  <td className="border p-2">{customer.name}</td>
                  <td className="border p-2">{customer.phone}</td>
                  <td className="border p-2">{customer.email}</td>
                  <td className="border p-2">
                    {new Date(customer.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2 flex gap-2">
                    <Link
                      href={`/dashboard/purchases/customers/${customer.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="flex items-center text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-8 text-center text-gray-500">
        Loading customer tools...
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CustomersPageContent />
    </Suspense>
  );
}
