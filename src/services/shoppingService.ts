import axios from "axios";
import { ShoppingItem } from "../types";

const BASE_URL = "/api/items/item"; // gunakan proxy lokal dari vite.config.js

const config = {
  headers: { "Content-Type": "application/json" },
};

interface ApiResponse<T> {
  message: string;
  data: T;
}

// Fetch semua item
export const fetchShoppingItems = async (): Promise<ShoppingItem[]> => {
  try {
    const response = await axios.get<ApiResponse<ShoppingItem[]>>(BASE_URL);
    return response.data?.data || [];
  } catch (error) {
    console.error("API Error fetching shopping items:", error);
    throw error;
  }
};

export const createShoppingItem = async (
  item: Omit<ShoppingItem, "id">
): Promise<ShoppingItem> => {
  try {
    const formData = new FormData();
    formData.append("name", item.name);
    formData.append("weight", String(item.weight));
    formData.append("price", String(item.price));
    formData.append("unit", item.unit);

    const response = await axios.post<ApiResponse<ShoppingItem>>(
      BASE_URL,
      formData
    );
    return response.data.data;
  } catch (error) {
    console.error("API Error creating shopping item:", error);
    throw error;
  }
};

// Update item
export const updateShoppingItem = async (
  item: ShoppingItem
): Promise<ShoppingItem> => {
  if (!item.id) throw new Error("Item ID is required for updating.");
  try {
    const response = await axios.patch<ApiResponse<ShoppingItem>>(
      `${BASE_URL}/${item.id}`,
      item,
      config
    );
    return response.data.data;
  } catch (error) {
    console.error(`API Error updating shopping item ${item.id}:`, error);
    throw error;
  }
};

// Delete item
export const deleteShoppingItem = async (
  id: number
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<ApiResponse<null>>(
      `${BASE_URL}/${id}`,
      config
    );
    return { message: response.data.message || "Data dihapus" };
  } catch (error) {
    console.error(`API Error deleting shopping item ${id}:`, error);
    throw error;
  }
};
