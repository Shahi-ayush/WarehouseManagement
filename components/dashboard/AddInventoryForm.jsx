


import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextInput from '@/components/FormInputs/TextInput';
import SelectInput from '@/components/FormInputs/SelectInput';
import TextareaInput from '@/components/FormInputs/TextareaInput';
import { makePostRequest } from '@/lib/apiRequest';

export default function AddInventoryForm({ warehouses, suppliers }) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [fetchingItems, setFetchingItems] = useState(false);

  const receivingWarehouseId = watch("receivingWarehouseId");

  // Fetch items for the selected receiving warehouse
  useEffect(() => {
    async function fetchItems() {
      if (!receivingWarehouseId) {
        setItems([]);
        return;
      }

      setFetchingItems(true);
      try {
        const res = await fetch(`/api/adjustments/add?receivingWarehouseId=${receivingWarehouseId}`);
        const data = await res.json();
        setItems(data.map(item => ({
          id: item.id,
          title: `${item.title} (Available: ${item.quantity})`,
        })));
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setFetchingItems(false);
      }
    }

    fetchItems();
  }, [receivingWarehouseId]);

  async function onSubmit(data) {
    const qty = parseInt(data.addStockQty);
    if (!data.itemId) {
      alert("Please select a valid item.");
      return;
    }
    if (qty <= 0) {
      alert("Quantity must be greater than zero.");
      return;
    }

    makePostRequest(setLoading, "api/adjustments/add", data, "StockAdjustment", reset);
  }

  const normalize = arr => Array.isArray(arr) ? arr : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-4xl my-5 mx-auto p-4 bg-white border rounded-lg shadow-sm'>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <TextInput label="Reference Number" name="referenceNumber" register={register} errors={errors} />
        <SelectInput
          label="Receiving Warehouse"
          name="receivingWarehouseId"
          register={register}
          options={normalize(warehouses)}
        />
        <SelectInput
          label="Select Item"
          name="itemId"
          register={register}
          options={normalize(items)}
          disabled={!receivingWarehouseId || fetchingItems}
        />
        <SelectInput label="Select Supplier" name="supplierId" register={register} options={normalize(suppliers)} />
        <TextInput label="Quantity to Add" name="addStockQty" type="number" register={register} errors={errors} />
        <TextareaInput label="Adjustment Notes" name="notes" register={register} errors={errors} />
      </div>
      <SubmitButton isLoading={loading} title="Add Stock" />
    </form>
  );
}
