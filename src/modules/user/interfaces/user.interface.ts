export interface UserInterface {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  createAt: Date;
  updateAt: Date;
}
