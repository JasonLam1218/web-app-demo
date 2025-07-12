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
  preferences?: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
} 