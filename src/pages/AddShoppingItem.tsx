import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import AppHeader from "../components/AppHeader";
import PageHeader from "../components/PageHeader";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import axios from "axios";

interface AddShoppingItemProps {
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  itemId?: number; // untuk edit mode
}
const BASE_URL = "http://fajarseptianto.my.id/api/items/item";
// ✅ Data dummy sementara untuk simulasi
const dummyData = [
  { id: 1, name: "Beras", weight: "2", price: "28000", unit: "Kilogram" },
  { id: 2, name: "Minyak", weight: "1", price: "15000", unit: "Liter" },
];

const AddShoppingItem: React.FC<AddShoppingItemProps> = ({
  onBack,
  onOpenProfile,
  onOpenNotifications,
  itemId,
}) => {
  const isEditMode = !!itemId;

  const [item, setItem] = useState({
    name: "",
    weight: "",
    price: "",
    unit: "kilogram",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Simulasi ambil data untuk edit
  useEffect(() => {
    if (isEditMode && itemId) {
      setLoading(true);
      setTimeout(() => {
        const foundItem = dummyData.find((i) => i.id === itemId);
        if (foundItem) {
          setItem({
            name: foundItem.name,
            weight: foundItem.weight,
            price: foundItem.price,
            unit: foundItem.unit,
          });
        } else {
          alert("Data tidak ditemukan (simulasi).");
        }
        setLoading(false);
      }, 500);
    }
  }, [isEditMode, itemId]);

  // 🔹 Handle input
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setItem((prev) => ({ ...prev, [id]: value }));
  };

  // 🔹 Simulasi submit tanpa request API
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // setTimeout(() => {
    if (isEditMode && itemId) {
      await axios.patch(`${BASE_URL}/${itemId}`, item);
      alert("Data berhasil diperbarui!");
    } else {
      // console.log("✅ Data baru disimpan:", item);
      await axios.post(BASE_URL, item);
      alert("Data berhasil disimpan!");
    }
    setIsSubmitting(false);
    // onBack();
    // }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat data item...
      </div>
    );
  }

  return (
    <div className="p-5 w-full max-w-md mx-auto">
      <AppHeader
        onOpenProfile={onOpenProfile}
        onOpenNotifications={onOpenNotifications}
      />
      <PageHeader
        title={isEditMode ? "Edit Belanjaan" : "Tambah Belanjaan"}
        onBack={onBack}
      />

      <form onSubmit={handleSubmit} className="space-y-6 w-full mt-8">
        <InputField
          label="Nama Barang"
          id="name"
          value={item.name}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Bobot"
            id="weight"
            type="number"
            value={item.weight}
            onChange={handleChange}
            required
          />
          <SelectField
            label="Satuan"
            id="unit"
            value={item.unit}
            onChange={handleChange}
          >
            <option value="kilogram">Kilogram</option>
            <option value="gram">Gram</option>
            <option value="liter">Liter</option>
            <option value="piece">Buah</option>
          </SelectField>
        </div>

        <InputField
          label="Harga"
          id="price"
          type="number"
          value={item.price}
          onChange={handleChange}
          placeholder="contoh: 15000"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-emerald-400 disabled:cursor-wait"
        >
          {isSubmitting ? "Menyimpan..." : isEditMode ? "Update" : "Simpan"}
        </button>
      </form>
    </div>
  );
};

export default AddShoppingItem;
