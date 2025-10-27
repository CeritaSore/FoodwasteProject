import axios from "axios";
import { InventoryItem } from "../types";

const BASE_URL = "http://fajarseptianto.my.id/api/items/inventory";
// Using a proxy to bypass CORS issues during development
const PROXY = "https://api.codetabs.com/v1/proxy?quest=";
const API_URL = `${PROXY}${BASE_URL}`;

const config = {
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
};

interface ApiResponse<T> {
  message: string;
  data: T;
}

const itemToFormData = (item: Omit<InventoryItem, 'id'>): URLSearchParams => {
  const formData = new URLSearchParams();
  formData.append("name", item.name);
  formData.append("weight", String(item.weight));
  formData.append("photo", item.photo);
  formData.append("store_at", item.store_at);
  formData.append("unit", item.unit);
  formData.append("expired_at", item.expired_at);
  return formData;
};

export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // Add a cache-busting query parameter to ensure fresh data is fetched
    const cacheBuster = `?_=${new Date().getTime()}`;
    const response = await axios.get<ApiResponse<InventoryItem[]>>(`${API_URL}${cacheBuster}`);
    return response.data?.data || [];
  } catch (error) {
    console.error("API Error fetching inventory:", error);
    throw error;
  }
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  try {
    const formData = itemToFormData(item);
    const response = await axios.post<ApiResponse<InventoryItem>>(API_URL, formData, config);
    return response.data.data;
  } catch (error) {
    console.error("API Error creating inventory item:", error);
    throw error;
  }
};

export const updateInventoryItem = async (item: InventoryItem): Promise<InventoryItem> => {
  if (!item.id) throw new Error("Item ID is required for updating.");
  try {
    const formData = itemToFormData(item);
    formData.append("_method", "PATCH");
    const response = await axios.post<ApiResponse<InventoryItem>>(`${API_URL}/${item.id}`, formData, config);
    return response.data.data;
  } catch (error) {
    console.error(`API Error updating inventory item ${item.id}:`, error);
    throw error;
  }
};

export const deleteInventoryItem = async (id: number): Promise<{ message: string }> => {
  try {
    const formData = new URLSearchParams();
    formData.append("_method", "DELETE");
    const response = await axios.post<ApiResponse<null>>(`${API_URL}/${id}`, formData, config);
    return { message: response.data.message || 'data dihapus' };
  } catch (error) {
    console.error(`API Error deleting inventory item ${id}:`, error);
    throw error;
  }
};
