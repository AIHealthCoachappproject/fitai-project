import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  name: string;
  age: string;
  gender: string;
  activityLevel: string;
  height: string;
  weight: string;
  profileImage: string | null;
  bmi: string;
}

interface ProfileContextType {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
  updateProfileField: (field: keyof ProfileData, value: string | null) => void;
  calculateBMI: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    age: '',
    gender: '',
    activityLevel: '',
    height: '',
    weight: '',
    profileImage: null,
    bmi: '0',
  });

  const updateProfileField = (field: keyof ProfileData, value: string | null) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(profile.weight);
    const height = parseFloat(profile.height) / 100;
    if (weight > 0 && height > 0) {
      const bmi = (weight / (height * height)).toFixed(1);
      setProfile((prev) => ({
        ...prev,
        bmi,
      }));
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, updateProfileField, calculateBMI }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
