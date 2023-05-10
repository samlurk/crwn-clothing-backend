export interface UserInterface {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  phone: string | null;
  role: string;
  avatar: string;
  isActive: boolean;
  createAt: Date;
  updateAt: Date;
}
