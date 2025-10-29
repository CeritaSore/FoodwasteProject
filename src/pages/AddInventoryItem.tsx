import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import AddItemForm from "../components/AddItemForm";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import CameraModal from "../components/CameraModal";
import { InventoryItem } from "../types";

interface AddInventoryItemProps {
  onBack: () => void;
  itemId?: number; // optional, digunakan untuk edit
}

const API_URL = "http://fajarseptianto.my.id/api/items/inventory";

const AddInventoryItem: React.FC<AddInventoryItemProps> = ({
  onBack,
  itemId,
}) => {
  const isEditMode = !!itemId;

  const [item, setItem] = useState({
    name: "",
    store_at: "chiller",
    weight: "",
    unit: "kilogram",
    expired_at: "",
    photo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // 🔹 Fetch data by ID jika mode edit
  useEffect(() => {
    if (isEditMode && itemId) {
      const fetchItem = async () => {
        try {
          const res = await axios.get(`${API_URL}`);
          const existingItem = res.data.data.find((i: any) => i.id === itemId);
          if (existingItem) {
            setItem({
              name: existingItem.name,
              store_at: existingItem.store_at,
              weight: existingItem.weight,
              unit: existingItem.unit,
              expired_at: existingItem.expired_at,
              photo: existingItem.photo,
            });
          }
        } catch (error) {
          console.error("Gagal memuat data:", error);
          alert("Gagal memuat data item.");
        } finally {
          setLoading(false);
        }
      };
      fetchItem();
    }
  }, [isEditMode, itemId]);

  // 🔹 Handle input perubahan
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setItem((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 🔹 Handle foto dari kamera
  const handlePhotoTaken = (dataUrl: string) => {
    setItem((prev) => ({ ...prev, photo: dataUrl }));
    setIsCameraOpen(false);
  };

  // 🔹 Handle submit (POST / PATCH)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!item.photo) {
      alert("Harap masukkan foto atau emoji untuk item.");
      return;
    }
    setIsSubmitting(true);

    try {
      if (isEditMode && itemId) {
        await axios.patch(`${API_URL}/${itemId}`, item);
        alert("Data berhasil diperbarui!");
      } else {
        await axios.post(API_URL, item);
        // alert("Data berhasil disimpan!");
        console.log(item);
      }
      onBack();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat data...
      </div>
    );
  }

  return (
    <>
      <AddItemForm
        onBack={onBack}
        title={isEditMode ? "Edit Simpanan" : "Tambah Simpanan"}
        imagePreview={item.photo}
        onImageButtonClick={() => setIsCameraOpen(true)}
      >
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <InputField
            label="Nama Barang"
            id="name"
            value={item.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Photo (Emoji atau Ambil Gambar)"
            id="photo"
            value={item.photo}
            onChange={handleChange}
            placeholder="contoh: 🍅 atau klik kamera"
            required
          />

          <SelectField
            label="Penyimpanan"
            id="store_at"
            value={item.store_at}
            onChange={handleChange}
          >
            <option value="freezer">Freezer</option>
            <option value="chiller">Chiller</option>
            <option value="room_temperature">Suhu Ruang</option>
          </SelectField>

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
            label="Expired pada"
            id="expired_at"
            type="date"
            value={item.expired_at}
            onChange={handleChange}
            placeholder="cth: 25 Des 2024"
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
      </AddItemForm>

      {isCameraOpen && (
        <CameraModal
          onCapture={handlePhotoTaken}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </>
  );
};

export default AddInventoryItem;
