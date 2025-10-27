import React from 'react';
import { View, InventoryItem } from '../types';
import AppHeader from '../components/AppHeader';
import PageHeader from '../components/PageHeader';
import FloatingActionButton from '../components/FloatingActionButton';
import Icon from '../components/Icon';

interface InventoryProps {
    onBack: () => void;
    onOpenProfile: () => void;
    onOpenNotifications: () => void;
    onNavigate: (view: View) => void;
    onSelectItem: (item: InventoryItem) => void;
    onEditItem: (item: InventoryItem) => void;
    onDeleteItem: (id: number) => void;
    inventory: InventoryItem[];
    isLoading: boolean;
}

const isBase64Image = (str: string | null | undefined): boolean => typeof str === 'string' && str.startsWith('data:image/');

const Inventory: React.FC<InventoryProps> = ({ onBack, onOpenProfile, onOpenNotifications, onNavigate, onSelectItem, onEditItem, onDeleteItem, inventory, isLoading }) => {
    
    const handleDelete = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        onDeleteItem(id);
    };

    const handleEdit = (e: React.MouseEvent, item: InventoryItem) => {
        e.stopPropagation();
        onEditItem(item);
    };

    return (
        <div className="p-5 w-full max-w-md mx-auto relative min-h-dvh">
            <AppHeader onOpenProfile={onOpenProfile} onOpenNotifications={onOpenNotifications} />
            <PageHeader title="Simpanan kamu" onBack={onBack} />
            <div className="space-y-4 pb-24">
                {isLoading ? (
                    <p className="text-center text-gray-500 animate-pulse">Loading inventory...</p>
                ) : inventory.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-gray-50 rounded-2xl">
                        <p className="font-semibold text-gray-600">Inventori kamu kosong.</p>
                        <p className="text-gray-400 text-sm mt-1">Tekan tombol '+' untuk mulai menambah.</p>
                    </div>
                ) : (
                    inventory.map(item => (
                        <div key={item.id} onClick={() => onSelectItem(item)} className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden">
                                {isBase64Image(item.photo) ? (
                                    <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    item.photo
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-600 -mt-0.5">{item.weight} {item.unit}</p>
                                <div className="flex flex-col text-xs text-gray-500 mt-2 space-y-1">
                                    <span className="flex items-center gap-1.5"><Icon name="box" className="h-3.5 w-3.5"/> Disimpan di: {item.store_at}</span>
                                    <span className="flex items-center gap-1.5"><Icon name="calendar" className="h-3.5 w-3.5"/> Expire pada: {item.expired_at}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" onClick={(e) => handleEdit(e, item)} aria-label={`Edit ${item.name}`}>
                                    <Icon name="edit" className="h-5 w-5" />
                                </button>
                                 <button className="p-2 text-red-400 hover:text-red-600 transition-colors" onClick={(e) => handleDelete(e, item.id)} aria-label={`Delete ${item.name}`}>
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <FloatingActionButton icon="plus" onClick={() => onNavigate('add_inventory_item')} />
        </div>
    );
};

export default Inventory;