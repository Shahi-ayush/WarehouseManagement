



import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextInput from '@/components/FormInputs/TextInput';
import SelectInput from '@/components/FormInputs/SelectInput';
import TextareaInput from '@/components/FormInputs/TextareaInput';
import { makePostRequest } from '@/lib/apiRequest';

export default function TransferInventoryForm({ warehouses }) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [fetchingItems, setFetchingItems] = useState(false);

  const givingWarehouseId = watch("givingWarehouseId"); // watch selected warehouse

  // Fetch items for the selected giving warehouse
  useEffect(() => {
    async function fetchItems() {
      if (!givingWarehouseId) {
        setItems([]);
        return;
      }

      setFetchingItems(true);
      try {
        const res = await fetch(`/api/adjustments/transfer?givingWarehouseId=${givingWarehouseId}`);
        const data = await res.json();
        // Map to {label, value} format for SelectInput
        setItems(data.map(item => ({ id: item.id, title: `${item.title} (Available: ${item.quantity})` })));
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setFetchingItems(false);
      }
    }

    fetchItems();
  }, [givingWarehouseId]);

  async function onSubmit(data) {
    const qty = parseInt(data.transferStockQty);
    if (!data.itemId) {
      alert("Please select a valid item.");
      return;
    }
    if (qty <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    makePostRequest(setLoading, "api/adjustments/transfer", data, "StockAdjustment", reset);
  }

  const normalize = arr => Array.isArray(arr) ? arr : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border rounded-lg shadow-sm'>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput label="Reference Number" name="referenceNumber" register={register} errors={errors} />
        <SelectInput label="Giving Warehouse" name="givingWarehouseId" register={register} options={normalize(warehouses)} />
        <SelectInput
          label="Select Item"
          name="itemId"
          register={register}
          options={normalize(items)}
          disabled={!givingWarehouseId || fetchingItems}
        />
        <SelectInput label="Receiving Warehouse" name="receivingWarehouseId" register={register} options={normalize(warehouses)} />
        <TextInput label="Quantity to Transfer" name="transferStockQty" type="number" register={register} errors={errors} />
        <TextareaInput label="Adjustment Notes" name="notes" register={register} errors={errors} />
      </div>
      <SubmitButton isLoading={loading} title="Transfer Stock" />
    </form>
  );
}
