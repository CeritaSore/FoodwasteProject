import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import AddItemForm from "../components/AddItemForm";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import CameraModal from "../components/CameraModal";
import { InventoryItem } from "../types";
import { useNavigate, useParams } from "react-router-dom";

interface AddInventoryItemProps {
  onBack: () => void;
}

const API_URL = "http://fajarseptianto.my.id/api/items/inventory";

// ✅ COMPRESSION FUNCTION
const compressBase64Image = (base64String: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64String;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      const maxWidth = 800;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
      console.log(
        `📊 Image compressed: ${(base64String.length / 1024).toFixed(1)}KB → ${(
          compressedBase64.length / 1024
        ).toFixed(1)}KB`
      );
      resolve(compressedBase64);
    };

    img.onerror = () => resolve(base64String);
  });
};

const isBase64Image = (str: string | null | undefined): boolean =>
  typeof str === "string" && str.startsWith("data:image/");

const AddInventoryItem: React.FC<AddInventoryItemProps> = ({ onBack }) => {
  // ✅ FIX: Gunakan useParams dengan benar
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const back = () => navigate("/inventory");
  const profile = () => navigate("/profileform");
  const notification = () => navigate("/notification");

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

  // ✅ FIX: Fetch data by ID yang benar
  useEffect(() => {
    const fetchItem = async () => {
      if (!isEditMode || !id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}`);
        console.log("📦 Full API Response:", response.data);

        const items = response.data.data || response.data || [];
        const existingItem = items.find(
          (i: InventoryItem) => i.id === parseInt(id)
        );

        console.log("🔍 Found item:", existingItem);

        if (existingItem) {
          setItem({
            name: existingItem.name || "",
            store_at: existingItem.store_at || "chiller",
            weight: existingItem.weight?.toString() || "",
            unit: existingItem.unit || "kilogram",
            expired_at: existingItem.expired_at || "",
            photo: existingItem.photo || "",
          });
        } else {
          console.error("❌ Item tidak ditemukan dengan ID:", id);
          alert("Item tidak ditemukan.");
          navigate("/inventory");
        }
      } catch (error) {
        console.error("❌ Gagal memuat data:", error);
        alert("Gagal memuat data item.");
        navigate("/inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [isEditMode, id, navigate]);

  // 🔹 Handle input perubahan
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle foto dari kamera - AUTO COMPRESS
  const handlePhotoTaken = async (dataUrl: string) => {
    try {
      let finalPhoto = dataUrl;

      if (isBase64Image(dataUrl)) {
        console.log("🔄 Compressing camera photo...");
        finalPhoto = await compressBase64Image(dataUrl);
      }

      setItem((prev) => ({ ...prev, photo: finalPhoto }));
      setIsCameraOpen(false);
    } catch (error) {
      console.error("Compression error:", error);
      setItem((prev) => ({ ...prev, photo: dataUrl }));
      setIsCameraOpen(false);
    }
  };

  // ✅ FIX: Handle submit yang lebih robust
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validasi required fields
    if (!item.name.trim() || !item.photo.trim()) {
      alert("Harap isi nama barang dan foto/emoji.");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalItem = { ...item };

      // ✅ COMPRESS PHOTO SEBELUM KIRIM KE API
      if (isBase64Image(item.photo)) {
        console.log("🔄 Compressing photo before submit...");
        finalItem.photo = await compressBase64Image(item.photo);
      }

      // ✅ Convert weight ke number
      const submitData = {
        ...finalItem,
        weight: Number(finalItem.weight) || 0,
      };

      console.log("📤 Submitting data:", submitData);

      if (isEditMode && id) {
        // ✅ FIX: Endpoint update yang benar
        await axios.patch(`${API_URL}/${id}`, submitData);
        alert("✅ Data berhasil diperbarui!");
      } else {
        await axios.post(API_URL, submitData);
        console.log("✅ Data berhasil disimpan:", submitData);
        alert("✅ Data berhasil disimpan!");
      }

      back();
    } catch (error: any) {
      console.error("❌ Gagal menyimpan data:", error);

      if (error.response?.status === 413) {
        alert(
          "Data gambar masih terlalu besar. Silakan gunakan gambar yang lebih kecil."
        );
      } else if (error.response?.data?.message) {
        alert(`Gagal menyimpan: ${error.response.data.message}`);
      } else {
        alert("Terjadi kesalahan saat menyimpan data.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          Memuat data item...
        </div>
      </div>
    );
  }

  return (
    <>
      <AddItemForm
        onBack={back}
        onOpenNotifications={notification}
        onOpenProfile={profile}
        title={isEditMode ? "Edit Simpanan" : "Tambah Simpanan"}
        imagePreview={item.photo}
        onImageButtonClick={() => setIsCameraOpen(true)}
      >
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <InputField
            label="Nama Barang"
            id="name"
            name="name"
            value={item.name}
            onChange={handleChange}
            placeholder="Contoh: Daging Sapi, Wortel, Telur"
            required
          />

          <InputField
            label="Photo (Emoji atau Ambil Gambar)"
            id="photo"
            name="photo"
            value={item.photo}
            onChange={handleChange}
            placeholder="contoh: 🍅 atau klik kamera"
            required
          />

          <SelectField
            label="Penyimpanan"
            id="store_at"
            name="store_at"
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
              name="weight"
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
              name="unit"
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
            name="expired_at"
            type="date"
            value={item.expired_at}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-200 disabled:bg-emerald-400 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Menyimpan..."
              : isEditMode
              ? "Update Data"
              : "Simpan Barang"}
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
