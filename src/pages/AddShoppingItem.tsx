import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import AppHeader from "../components/AppHeader";
import PageHeader from "../components/PageHeader";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface AddShoppingItemProps {
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

const BASE_URL = "http://fajarseptianto.my.id/api/items/item";

const AddShoppingItem: React.FC<AddShoppingItemProps> = ({
  onBack,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const { id } = useParams<{ id: string }>(); // ✅ Gunakan destructuring
  const isEditMode = !!id; // ✅ Gunakan id dari URL params

  const navigate = useNavigate();

  const [item, setItem] = useState({
    name: "",
    weight: "",
    price: "",
    unit: "kilogram", // ✅ Default value
  });

  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Ambil data dari API jika mode edit
  useEffect(() => {
    if (isEditMode && itemId) {
      setLoading(true);
      axios
        .get(`${BASE_URL}/${itemId}`)
        .then((res) => {
          const data = res.data?.data;
          if (data) {
            setItem({
              name: data.name || "",
              weight: data.weight || "",
              price: data.price || "",
              unit: data.unit || "kilogram",
            });
          } else {
            alert("Data item tidak ditemukan.");
          }
        })
        .catch((err) => {
          console.error("❌ Gagal memuat data:", err);
          alert("Gagal memuat data item dari server.");
        })
        .finally(() => setLoading(false));
    }
  }, [isEditMode, itemId]);

  // ✅ HANDLE INPUT
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setItem((prev) => ({ ...prev, [id]: value }));
  };

  // 🔹 Submit form (Create / Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ✅ VALIDASI INPUT
    if (!item.name.trim() || !item.weight || !item.price) {
      alert("Harap isi semua field yang wajib!");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && itemId) {
        await axios.patch(`${BASE_URL}/${itemId}`, item);
        alert("✅ Data berhasil diperbarui!");
      } else {
        await axios.post(BASE_URL, item);
        alert("✅ Data baru berhasil disimpan!");
      }
      onBack();
    } catch (err) {
      console.error("❌ Gagal menyimpan:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="p-5 w-full max-w-md mx-auto">
        <AppHeader onOpenProfile={profile} onOpenNotifications={notification} />
        <PageHeader
          title={isEditMode ? "Edit Belanjaan" : "Tambah Belanjaan"}
          onBack={back}
        />
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
            Memuat data item...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 w-full max-w-md mx-auto">
      <AppHeader onOpenProfile={profile} onOpenNotifications={notification} />
      <PageHeader
        title={isEditMode ? "Edit Belanjaan" : "Tambah Belanjaan"}
        onBack={back}
      />

      <form onSubmit={handleSubmit} className="space-y-6 w-full mt-8">
        <InputField
          label="Nama Barang"
          id="name"
          value={item.name}
          onChange={handleChange}
          placeholder="Contoh: Beras, Gula, Minyak Goreng"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Bobot"
            id="weight"
            type="number"
            value={item.weight}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.1"
            required
          />
          <SelectField
            label="Satuan"
            id="unit"
            value={item.unit}
            onChange={handleChange}
            required
          >
            <option value="">Pilih Satuan</option>
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
          placeholder="Contoh: 15000"
          min="0"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting
            ? "Menyimpan..."
            : isEditMode
            ? "Update"
            : "Simpan"}
        </button>
      </form>
    </div>
  );
};

export default AddShoppingItem;
