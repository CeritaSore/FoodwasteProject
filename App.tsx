import React, { useState, useEffect } from 'react';
import { UserProfile, View, InventoryItem, ShoppingItem } from './src/types';
import { fetchInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from './src/services/inventoryService';
import { fetchShoppingItems, createShoppingItem, updateShoppingItem, deleteShoppingItem } from './src/services/shoppingService';


// Import pages
import ProfileForm from './src/pages/ProfileForm';
import Dashboard from './src/pages/Dashboard';
import Notifications from './src/pages/Notifications';
import MenuRecommendation from './src/pages/MenuRecommendation';
import WeeklyShopping from './src/pages/WeeklyShopping';
import AddShoppingItem from './src/pages/AddShoppingItem';
import Inventory from './src/pages/Inventory';
import AddInventoryItem from './src/pages/AddInventoryItem';
import InventoryItemDetail from './src/pages/InventoryItemDetail';


const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('profile_form');
  
  // Inventory State
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null);

  // Shopping List State
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoadingShoppingList, setIsLoadingShoppingList] = useState(true);
  const [selectedShoppingItem, setSelectedShoppingItem] = useState<ShoppingItem | null>(null);


  const loadInventory = async () => {
    setIsLoadingInventory(true);
    try {
      const items = await fetchInventoryItems();
      setInventory(items);
    } catch (error) {
      console.error("Failed to load inventory:", error);
      // Optionally show an error to the user
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const loadShoppingList = async () => {
    setIsLoadingShoppingList(true);
    try {
      const items = await fetchShoppingItems();
      setShoppingList(items);
    } catch (error) {
      console.error("Failed to load shopping list:", error);
      // Optionally show an error to the user
    } finally {
      setIsLoadingShoppingList(false);
    }
  };

  useEffect(() => {
    if (currentView === 'profile_form') {
        // Don't load anything on the initial form
    } else if (currentView === 'dashboard') {
        loadInventory();
        loadShoppingList();
    } else if (currentView === 'inventory') {
        loadInventory();
    } else if (currentView === 'weekly_shopping') {
        loadShoppingList();
    }
  }, [currentView]);

  const handleProfileSubmit = (profileData: UserProfile) => {
    setUserProfile(profileData);
    if(currentView === 'profile_form') setCurrentView('dashboard');
    setIsProfileModalOpen(false);
  };
  
  // --- INVENTORY HANDLERS ---
  const handleSelectInventoryItem = (item: InventoryItem) => {
    setSelectedInventoryItem(item);
    setCurrentView('inventory_item_detail');
  };

  const handleEditInventoryItem = (item: InventoryItem) => {
    setSelectedInventoryItem(item);
    setCurrentView('edit_inventory_item');
  }

  const handleSaveInventoryItem = async (item: Omit<InventoryItem, 'id'> | InventoryItem) => {
    try {
      if ('id' in item) {
        const updatedItem = await updateInventoryItem(item);
        setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
      } else {
        const newItem = await createInventoryItem(item);
        setInventory(prev => [...prev, newItem]);
      }
      setCurrentView('inventory');
    } catch (error) {
      console.error("Failed to save inventory item:", error);
      alert("Gagal menyimpan item inventaris. Silakan periksa koneksi Anda dan coba lagi.");
      // On error, reload the list to ensure data consistency
      await loadInventory();
    }
  };

  const handleDeleteInventoryItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await deleteInventoryItem(id);
        setInventory(prev => prev.filter(item => item.id !== id));
        if (currentView === 'inventory_item_detail') {
          setCurrentView('inventory');
        }
      } catch (error) {
        console.error("Failed to delete inventory item:", error);
        alert("Gagal menghapus item inventaris. Silakan coba lagi.");
      }
    }
  };

  // --- SHOPPING LIST HANDLERS ---
  const handleEditShoppingItem = (item: ShoppingItem) => {
    setSelectedShoppingItem(item);
    setCurrentView('edit_shopping_item');
  }

  const handleSaveShoppingItem = async (item: Omit<ShoppingItem, 'id'> | ShoppingItem) => {
    try {
      if ('id' in item) {
        const updatedItem = await updateShoppingItem(item);
        setShoppingList(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
      } else {
        const newItem = await createShoppingItem(item);
        setShoppingList(prev => [...prev, newItem]);
      }
      setCurrentView('weekly_shopping');
    } catch (error) {
      console.error("Failed to save shopping item:", error);
      alert("Gagal menyimpan item belanja. Silakan periksa koneksi Anda dan coba lagi.");
       // On error, reload the list to ensure data consistency
      await loadShoppingList();
    }
  };

  const handleDeleteShoppingItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this shopping item?')) {
      try {
        await deleteShoppingItem(id);
        setShoppingList(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Failed to delete shopping item:", error);
        alert("Gagal menghapus item belanja. Silakan coba lagi.");
      }
    }
  };


  const renderContent = () => {
    const commonProps = {
        onOpenProfile: () => setIsProfileModalOpen(true),
        onOpenNotifications: () => setCurrentView('notifications')
    };

    switch(currentView) {
      case 'profile_form': return <ProfileForm onProfileSubmit={handleProfileSubmit} />;
      case 'dashboard': return userProfile && <Dashboard userProfile={userProfile} {...commonProps} onNavigate={setCurrentView} />;
      case 'notifications': return <Notifications {...commonProps} onBack={() => setCurrentView('dashboard')} />;
      case 'menu_recommendation': return <MenuRecommendation {...commonProps} onBack={() => setCurrentView('dashboard')} />;
      
      // Shopping List Views
      case 'weekly_shopping': return <WeeklyShopping {...commonProps} shoppingList={shoppingList} isLoading={isLoadingShoppingList} onBack={() => setCurrentView('dashboard')} onNavigate={setCurrentView} onEditItem={handleEditShoppingItem} onDeleteItem={handleDeleteShoppingItem} />;
      case 'add_shopping_item': return <AddShoppingItem {...commonProps} onBack={() => setCurrentView('weekly_shopping')} onSave={handleSaveShoppingItem} />;
      case 'edit_shopping_item': 
        if (selectedShoppingItem) return <AddShoppingItem itemToEdit={selectedShoppingItem} {...commonProps} onBack={() => setCurrentView('weekly_shopping')} onSave={handleSaveShoppingItem} />;
        setCurrentView('weekly_shopping'); return null;

      // Inventory Views
      case 'inventory': return <Inventory {...commonProps} inventory={inventory} isLoading={isLoadingInventory} onBack={() => setCurrentView('dashboard')} onNavigate={setCurrentView} onSelectItem={handleSelectInventoryItem} onEditItem={handleEditInventoryItem} onDeleteItem={handleDeleteInventoryItem} />;
      case 'add_inventory_item': return <AddInventoryItem {...commonProps} onBack={() => setCurrentView('inventory')} onSave={handleSaveInventoryItem} />;
      case 'edit_inventory_item': 
        if (selectedInventoryItem) return <AddInventoryItem itemToEdit={selectedInventoryItem} {...commonProps} onBack={() => setCurrentView('inventory')} onSave={handleSaveInventoryItem} />;
        setCurrentView('inventory'); return null;
      case 'inventory_item_detail': 
        if (selectedInventoryItem) return <InventoryItemDetail item={selectedInventoryItem} {...commonProps} onBack={() => setCurrentView('inventory')} onEdit={handleEditInventoryItem} onDelete={handleDeleteInventoryItem} />;
        setCurrentView('inventory'); return null; // Fallback
      default: return <ProfileForm onProfileSubmit={handleProfileSubmit} />;
    }
  }

  return (
    <main className="bg-[#FEFBF6] min-h-dvh font-sans antialiased text-gray-800">
      {renderContent()}
      {isProfileModalOpen && userProfile && (
        <ProfileForm onProfileSubmit={handleProfileSubmit} initialProfileData={userProfile} isModal={true} onClose={() => setIsProfileModalOpen(false)} />
      )}
    </main>
  );
};

export default App;