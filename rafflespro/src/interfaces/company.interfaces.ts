export interface CompanyRow {
    id?: number;
    name: string;
    taxId: string;
    email?: string;
    website?: string;
    logoURL?: string;
    plan?: string;
    periodicity?: string;
    lastPayment?: string;
    expiratedDate: string;
    dateAt: string;
    hourAt: string;
    isActive: boolean;
}

