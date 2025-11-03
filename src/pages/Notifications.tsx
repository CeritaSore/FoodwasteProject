import React from "react";
import AppHeader from "../components/AppHeader";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icon";
import { useNavigate } from "react-router-dom";

const Notifications: React.FC<{
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}> = ({ onBack, onOpenProfile, onOpenNotifications }) => {
  const navigate = useNavigate();
  const home = () => {
    navigate("/");
  };
  const notification = () => {
    navigate("/notification");
  };
  const profile = () => {
    navigate("/profileform");
  };
  return (
    <div className="p-5 w-full max-w-md mx-auto">
      <AppHeader onOpenProfile={profile} onOpenNotifications={notification} />
      <PageHeader title="Cek notifikasi masuk" onBack={home} />
      <div className="space-y-4">
        {[
          {
            title: "Makanan kamu akan expired dalam 5 hari !",
            desc: "Segera masak makanan kamu atau lebih baik kasih ke tetangga aja biar tidak mubazir.",
          },
          {
            title: "Makanan kamu akan expired dalam 3 hari !",
            desc: "Segera masak makanan kamu atau lebih baik kasih ke tetangga aja biar tidak mubazir.",
          },
          {
            title: "Makanan kamu akan expired dalam 1 hari !",
            desc: "Segera masak makanan kamu atau lebih baik kasih ke tetangga aja biar tidak mubazir.",
          },
          {
            title: "Yah !, makanan kamu udah expired",
            desc: "Segera masak makanan kamu atau lebih baik kasih ke tetangga aja biar tidak mubazir.",
          },
        ].map((item, index) => (
          <div key={index} className="border-b border-gray-200/80 pb-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-gray-500">
                <Icon name="info" className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
