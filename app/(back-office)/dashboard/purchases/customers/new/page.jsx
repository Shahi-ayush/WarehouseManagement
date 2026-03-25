import CustomerForm from "@/components/customers/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Add Customer</h1>
      <CustomerForm />
    </div>
  );
}
