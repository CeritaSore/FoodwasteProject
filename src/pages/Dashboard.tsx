import React, { useEffect, useState } from "react";
import { UserProfile, View } from "../types";
import AppHeader from "../components/AppHeader";
import Icon from "../components/Icon";
import { fetchFirstUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC<{
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onNavigate: (view: View) => void;
}> = ({ userProfile }) => {
  const [data, setData] = useState<UserProfile | null>(null);
  const navigate = useNavigate();
  const profile = () => {
    navigate("/profileform");
  };
  const notification = () => {
    navigate("/notification");
  };
  const inventory = () => {
    navigate("/inventory");
  };
  const shoppingItems = () => {
    navigate("/items");
  };
  const recommendation = () => {
    navigate("/recommendation");
  };
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchFirstUser();
        setData(user);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    loadUser();
  }, []);

  // Hitung otomatis BMI dan Kalori
  const calculateStats = () => {
    if (!data) return { bmi: 0, calories: 0 };
    const height = Number(data.height) || 170;
    const weight = Number(data.weight) || 60;
    const ages = Number(data.ages) || 20;
    const dailyactivities = data.dailyactivities || "sedang";

    const bmi = (weight / (height / 100) ** 2).toFixed(1);

    const activityFactor = dailyactivities.toLowerCase().includes("berat")
      ? 1.725
      : dailyactivities.toLowerCase().includes("ringan")
      ? 1.375
      : 1.55;

    const bmr = 66 + 13.7 * weight + 5 * height - 6.8 * ages;
    const calories = Math.round(bmr * activityFactor);

    return { bmi, calories };
  };

  const { bmi, calories } = calculateStats();

  const StatCard: React.FC<{
    value: string | number;
    label: string;
    unit?: string;
    valueColor?: string;
    className?: string;
    isLarge?: boolean;
  }> = ({
    value,
    label,
    unit,
    valueColor = "text-green-500",
    className = "",
    isLarge = false,
  }) => (
    <div
      className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-200/80 flex flex-col justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      <div
        className={`flex items-baseline justify-center ${
          isLarge ? "flex-col items-center" : ""
        }`}
      >
        <span
          className={`font-bold ${
            isLarge ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"
          } ${valueColor}`}
        >
          {value}
        </span>
        {unit && (
          <span
            className={`ml-1 font-semibold ${valueColor} ${
              isLarge ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
      <p className="text-center text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );

  const ToolCard: React.FC<{
    label: string;
    iconName: string;
    onClick?: () => void;
  }> = ({ label, iconName, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 flex flex-col gap-3 items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="bg-emerald-100 text-emerald-600 rounded-full p-3">
        <Icon name={iconName} className="h-7 w-7" />
      </div>
      <p className="text-gray-600 font-semibold text-center text-sm">{label}</p>
    </div>
  );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-center text-gray-500 animate-pulse mt-10">
          Memuat data...
        </p>
      </div>
    );

  return (
    <div className="p-5 w-full max-w-md mx-auto">
      <AppHeader onOpenProfile={profile} onOpenNotifications={notification} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Hola, {data.fullname || "Pengguna"}!
        </h1>
        <p className="text-gray-500 mt-1">Statistik tubuh kamu hari ini</p>
      </div>
      <div className="grid grid-cols-2 grid-rows-3 gap-4 mb-8">
        <StatCard
          className="row-span-2 !py-8"
          value={calories}
          unit="kkal"
          label="Kalori harian diperlukan"
          isLarge={true}
        />
        <StatCard value="80%" label="Bahan Terpakai" />
        <StatCard
          value="20%"
          label="Bahan Terbuang"
          valueColor="text-red-500"
        />
        <StatCard value={bmi} label="BMI Score" />
        <StatCard value="12" unit="Kg" label="Food waste dicegah" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tools Pilihan</h2>
        <div className="grid grid-cols-3 gap-3">
          <ToolCard
            label="Rekomendasi Menu"
            iconName="menu"
            onClick={recommendation}
          />
          <ToolCard
            label="Belanja Mingguan"
            iconName="cart"
            onClick={shoppingItems}
          />
          <ToolCard
            label="Inventori Kamu"
            iconName="inventory"
            onClick={inventory}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
