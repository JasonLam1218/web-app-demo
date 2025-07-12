export interface UserType {
  _id: string;
  email: string;
  fullName: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileType {
  _id: string;
  user: string;
  bio?: string;
  avatar?: string;
  preferences?: Record<string, unknown>; // Changed from { [key: string]: any } to Record<string, unknown>
  createdAt: string;
  updatedAt: string;
} 