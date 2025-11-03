import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { UserProfile } from "../types";
import Icon from "../components/Icon";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ProfileFormProps {
  onProfileSubmit: (profile: UserProfile) => void;
  initialProfileData?: UserProfile | null;
  isModal?: boolean;
  onClose?: () => void;
}

const BASE_URL = "http://fajarseptianto.my.id/api/items/users";

const ProfileForm: React.FC<ProfileFormProps> = ({
  onProfileSubmit,
  initialProfileData = null,
  isModal = false,
  onClose,
}) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({
    id: undefined,
    fullname: "",
    memberoffamily: "",
    height: "",
    weight: "",
    ages: "",
    dailyactivities: "",
    sex: "",
    dietpreference: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ FETCH FIRST USER - langsung di component
  const fetchFirstUser = async (): Promise<UserProfile | null> => {
    try {
      console.log("🔄 Fetching users from:", BASE_URL);
      const response = await axios.get(BASE_URL);
      console.log("📦 Users response:", response.data);

      const data = response.data?.data || response.data || [];
      if (data && data.length > 0) {
        console.log("✅ Found user:", data[0]);
        return data[0];
      }
      console.log("ℹ️ No users found");
      return null;
    } catch (error: any) {
      console.error("❌ Error fetching users:", error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  };

  // ✅ CREATE USER PROFILE - langsung di component
  const createUserProfile = async (
    profile: UserProfile
  ): Promise<UserProfile> => {
    try {
      const jsonData = {
        fullname: profile.fullname,
        memberoffamily: Number(profile.memberoffamily) || 0,
        height: Number(profile.height) || 0,
        weight: Number(profile.weight) || 0,
        ages: Number(profile.ages) || 0,
        dailyactivities: profile.dailyactivities,
        sex: profile.sex,
        dietpreference: profile.dietpreference,
      };

      console.log("📤 Creating profile:", jsonData);

      const response = await axios.post(BASE_URL, jsonData);
      console.log("✅ Profile created:", response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error("❌ Error creating profile:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  };

  // ✅ UPDATE USER PROFILE - langsung di component
  const updateUserProfile = async (
    profile: UserProfile
  ): Promise<UserProfile> => {
    try {
      if (!profile.id) {
        throw new Error("User ID is required for updating.");
      }

      const jsonData = {
        fullname: profile.fullname,
        memberoffamily: Number(profile.memberoffamily) || 0,
        height: Number(profile.height) || 0,
        weight: Number(profile.weight) || 0,
        ages: Number(profile.ages) || 0,
        dailyactivities: profile.dailyactivities,
        sex: profile.sex,
        dietpreference: profile.dietpreference,
      };

      console.log("📤 Updating profile ID:", profile.id, "Data:", jsonData);

      const response = await axios.patch(`${BASE_URL}/${profile.id}`, jsonData);
      console.log("✅ Profile updated:", response.data);

      return response.data.data || response.data;
    } catch (error: any) {
      console.error("❌ Error updating profile:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const user = await fetchFirstUser();
        if (user) {
          setProfile({
            id: user.id,
            fullname: user.fullname ?? "",
            memberoffamily: String(user.memberoffamily ?? ""),
            height: String(user.height ?? ""),
            weight: String(user.weight ?? ""),
            ages: String(user.ages ?? ""),
            dailyactivities: user.dailyactivities ?? "",
            sex: user.sex ?? "",
            dietpreference: user.dietpreference ?? "",
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage("Failed to load user data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    if (initialProfileData) {
      setProfile(initialProfileData);
      setLoading(false);
    } else {
      loadUser();
    }
  }, [initialProfileData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    console.log("🔄 Starting submit with data:", profile);

    try {
      let responseData;
      if (profile.id) {
        console.log("📝 Update mode, ID:", profile.id);
        responseData = await updateUserProfile(profile);
        setMessage("Profile updated successfully!");
      } else {
        console.log("🆕 Create mode");
        responseData = await createUserProfile(profile);
        setMessage("Profile created successfully!");
      }

      console.log("✅ Submit successful:", responseData);

      if (responseData) {
        navigate("/");
      }
    } catch (err: any) {
      console.error("❌ Submit error:", err);
      setMessage(
        `Failed to save profile: ${err.message}. Please check your connection and try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !isModal) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <p className="text-gray-500 animate-pulse">Loading data...</p>
      </div>
    );
  }

  const formContent = (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl relative animate-slide-up">
      {isModal && onClose && (
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon name="close" className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Complete Your Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="fullname"
            value={profile.fullname}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="memberoffamily"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Family Members
            </label>
            <input
              id="memberoffamily"
              type="number"
              value={profile.memberoffamily}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label
              htmlFor="ages"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Age
            </label>
            <input
              id="ages"
              type="number"
              value={profile.ages}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              value={profile.height}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              required
            />
          </div>
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              value={profile.weight}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="dailyactivities"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Daily Activities
          </label>
          <input
            id="dailyactivities"
            value={profile.dailyactivities}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
            placeholder="e.g., Office worker"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="sex"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sex
            </label>
            <select
              id="sex"
              value={profile.sex}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none"
              required
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="dietpreference"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Diet Preference
            </label>
            <select
              id="dietpreference"
              value={profile.dietpreference}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-white appearance-none"
              required
            >
              <option value="">Select Preference</option>
              <option value="normal">Normal</option>
              <option value="dietintermittent">Intermittent Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 ease-in-out shadow-md disabled:bg-emerald-400 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Saving..."
            : profile.id
            ? "Update Profile"
            : "Save Profile"}
        </button>
      </form>

      {message && (
        <p
          className={`text-center mt-4 text-sm ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
        {formContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-50 p-6">
      {formContent}
    </div>
  );
};

export default ProfileForm;
