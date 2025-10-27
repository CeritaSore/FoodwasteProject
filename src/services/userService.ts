import axios from "axios";
import { UserProfile } from "../types";

const BASE_URL = "http://fajarseptianto.my.id/api/items/users";
// Using a proxy to bypass CORS issues during development
const PROXY = "https://api.codetabs.com/v1/proxy?quest=";
const API_URL = `${PROXY}${BASE_URL}`;

const config = {
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
};

// Define a generic API response structure for better typing
interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Fetches the list of users and returns the first one found.
 * @returns A UserProfile object or null if no users are found.
 */
export const fetchFirstUser = async (): Promise<UserProfile | null> => {
  const response = await axios.get<ApiResponse<UserProfile[]>>(API_URL);
  const data = response.data?.data;
  if (data && data.length > 0) {
    return data[0];
  }
  return null;
};

/**
 * Converts a UserProfile object to URLSearchParams for the API request.
 * @param profile The user profile data.
 * @returns URLSearchParams object.
 */
const profileToFormData = (profile: UserProfile): URLSearchParams => {
  const formData = new URLSearchParams();
  formData.append("fullname", profile.fullname);
  formData.append("memberoffamily", String(profile.memberoffamily));
  formData.append("height", String(profile.height));
  formData.append("weight", String(profile.weight));
  formData.append("ages", String(profile.ages));
  formData.append("dailyactivities", profile.dailyactivities);
  formData.append("sex", profile.sex);
  formData.append("dietpreference", profile.dietpreference);
  return formData;
};

/**
 * Creates a new user profile via a POST request.
 * @param profile The user profile data to create.
 * @returns The newly created UserProfile.
 */
export const createUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  const formData = profileToFormData(profile);
  const response = await axios.post<ApiResponse<UserProfile>>(`${API_URL}`, formData, config);
  return response.data.data;
};

/**
 * Updates an existing user profile via a POST request with method overriding.
 * @param profile The user profile data to update. Must include an ID.
 * @returns The updated UserProfile.
 */
export const updateUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  if (!profile.id) {
    throw new Error("User ID is required for updating.");
  }
  const formData = profileToFormData(profile);
  // Use method overriding for PATCH, as it's more reliable across proxies and networks.
  formData.append("_method", "PATCH");
  const response = await axios.post<ApiResponse<UserProfile>>(`${API_URL}/${profile.id}`, formData, config);
  return response.data.data;
};
