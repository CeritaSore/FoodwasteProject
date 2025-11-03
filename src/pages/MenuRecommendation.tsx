import React from "react";
import AppHeader from "../components/AppHeader";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";

const MenuRecommendation: React.FC<{
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}> = () => {
  const menuItems = [
    { icon: "🍚", name: "Nasi", amount: "150 gram" },
    { icon: "🥕", name: "Sayur-sayuran", amount: "80 gram" },
    { icon: "🍗", name: "Lauk : ayam", amount: "70 gram" },
  ];
  const navigate = useNavigate();
  const profile = () => {
    navigate("/profileform");
  };
  const notification = () => {
    navigate("/notification");
  };
  const home = () => {
    navigate("/");
  };
  return (
    <div className="p-5 w-full max-w-md mx-auto text-center">
      <AppHeader
        onOpenProfile={profile}
        onOpenNotifications={notification}
      />
      <PageHeader title="Rekomendasi menu" onBack={home} />
      <div className="flex flex-col items-center gap-6">
        <div className="text-7xl relative my-4">
          <span className="absolute -top-2 -left-4 text-yellow-400 text-3xl animate-pulse">
            ✨
          </span>
          <span className="relative z-10">🍴</span>
          <span className="relative -ml-8 z-0">🍽️</span>
          <span
            className="absolute -bottom-2 -right-4 text-yellow-400 text-5xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            ✨
          </span>
        </div>
        <p className="text-gray-600 text-lg">Porsi menu yang ideal buat kamu</p>
        <div className="grid grid-cols-2 gap-4 w-full mt-3">
          {menuItems.map((item, index) => {
            const isLastItem = index === menuItems.length - 1;
            const isOddLength = menuItems.length % 2 !== 0;
            const cardClassName = `bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              isLastItem && isOddLength ? "col-span-2" : ""
            }`;

            return (
              <div key={item.name} className={cardClassName}>
                <span className="text-4xl">{item.icon}</span>
                <p className="font-bold text-gray-800 mt-2">{item.name}</p>
                <p className="text-sm text-gray-500">{item.amount}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuRecommendation;
