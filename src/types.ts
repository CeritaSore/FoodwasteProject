export interface UserProfile {
  id?: number;
  fullname: string;
  memberoffamily: string | number;
  height: string | number;
  weight: string | number;
  ages: string | number;
  dailyactivities: string;
  sex: 'male' | 'female' | '';
  dietpreference: 'normal' | 'dietintermittent' | 'vegetarian' | 'vegan' | '';
}

export type View =
  | 'profile_form'
  | 'dashboard'
  | 'notifications'
  | 'menu_recommendation'
  | 'weekly_shopping'
  | 'add_shopping_item'
  | 'edit_shopping_item'
  | 'inventory'
  | 'add_inventory_item'
  | 'edit_inventory_item'
  | 'inventory_item_detail';

export interface InventoryItem {
  id: number;
  name: string;
  weight: number; // pakai number karena dari DB decimal
  photo: string;
  store_at: 'chiller' | 'freezer';
  unit: 'kilogram' | 'gram';
  expired_at: Date; // format: YYYY-MM-DD
}

export interface ShoppingItem {
  id: number;
  name: string;
  weight: number; // decimal → number
  unit: 'kilogram' | 'gram';
  price: number; // decimal → number
}
