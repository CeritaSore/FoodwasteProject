import React, { useState } from 'react';
import { InventoryItem } from '../types';
import AppHeader from '../components/AppHeader';
import PageHeader from '../components/PageHeader';
import FloatingActionButton from '../components/FloatingActionButton';

interface InventoryItemDetailProps {
  item: InventoryItem;
  onBack: () => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

const isBase64Image = (str: string | null | undefined): boolean => typeof str === 'string' && str.startsWith('data:image/');

const InventoryItemDetail: React.FC<InventoryItemDetailProps> = ({ item, onBack, onOpenProfile, onOpenNotifications, onEdit, onDelete }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="p-5 w-full max-w-md mx-auto relative min-h-dvh">
      <AppHeader onOpenProfile={onOpenProfile} onOpenNotifications={onOpenNotifications} />
      <PageHeader title="Detail Simpanan" onBack={onBack} />
      <div className="flex flex-col items-center gap-6 pt-4">
        <div className="text-8xl w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
          {isBase64Image(item.photo) ? (
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            item.photo
          )}
        </div>
        <h2 className="text-3xl font-bold text-gray-800">{item.name}</h2>
        <label htmlFor="notification-toggle" className="flex items-center cursor-pointer gap-3">
          <div className="relative">
            <input type="checkbox" id="notification-toggle" className="sr-only" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
            <div className={`block w-14 h-8 rounded-full transition-colors ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ease-in-out ${notificationsEnabled ? 'translate-x-6' : ''}`}></div>
          </div>
          <span className="text-sm text-gray-600">Aktifkan notifikasi pengingat</span>
        </label>
        <div className="text-left w-full space-y-2 pt-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/80">
            <div className="flex justify-between items-center py-2 border-b border-gray-200/80">
                <span className="font-semibold text-gray-500">Penyimpanan</span>
                <span className="font-medium text-gray-800">{item.store_at}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200/80">
                <span className="font-semibold text-gray-500">Bobot</span>
                <span className="font-medium text-gray-800">{item.weight} {item.unit}</span>
            </div>
            <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-500">Expired pada</span>
                <span className="font-medium text-gray-800">{item.expired_at}</span>
            </div>
        </div>
        <button 
          onClick={() => onDelete(item.id)}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Delete Item
        </button>
      </div>
      <FloatingActionButton icon="edit" onClick={() => onEdit(item)} />
    </div>
  );
};

export default InventoryItemDetail;