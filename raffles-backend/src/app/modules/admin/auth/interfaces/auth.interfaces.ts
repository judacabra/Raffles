import { Company } from "../../company/entities/company.entity";

export interface UserResponse {
    id: number;
    email: string;
    username: string;
    imageURL: string;
    isActive: boolean;
    roleId: number;
    rolePermissions: string[];
    companies: Company[],
}