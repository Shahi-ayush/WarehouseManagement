

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(data) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      setLoading(true);
      setEmailErr("");

      const response = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("User Created Successfully");
        reset();
        router.push("/login");
      } else {
        if (response.status === 409) {
          setEmailErr("User with this Email already exists");
          toast.error("User with this Email already exists");
        } else {
          toast.error(responseData?.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      {/* Name */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your name
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          type="text"
          placeholder="John Doe"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.name && (
          <small className="text-red-600">{errors.name.message}</small>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your email
        </label>
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="name@company.com"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.email && (
          <small className="text-red-600">{errors.email.message}</small>
        )}
        {emailErr && <small className="text-red-600">{emailErr}</small>}
      </div>

      {/* Password */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Password
        </label>
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.password && (
          <small className="text-red-600">{errors.password.message}</small>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Confirm Password
        </label>
        <input
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.confirmPassword && (
          <small className="text-red-600">
            {errors.confirmPassword.message}
          </small>
        )}
      </div>

      {/* Show Password Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="w-4 h-4"
        />
        <label
          htmlFor="showPassword"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          Show password
        </label>
      </div>

      {/* Submit Button */}
      {loading ? (
        <button
          disabled
          className="w-full text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Creating account...
        </button>
      ) : (
        <button
          type="submit"
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Sign Up
        </button>
      )}

      {/* Login Link */}
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
