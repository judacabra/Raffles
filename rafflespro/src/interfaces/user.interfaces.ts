import { RoleType } from "@/types/role.types";

export interface UserRow {
  id?: number;
  username: string;
  email: string;
  company: string;
  role: RoleType;
  roleId?: number;
  isActive: boolean;
  imageURL?: string;
}