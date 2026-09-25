export interface Sale {
    buyer: string;
    description: string;
    phone: string;
    numbers: number[];
    totalNumbers: number;
    totalPrice: number;
    dateAt?: string;
    ip: string;
    raffleId: number;
    companyId: number;
    sellerId?: number;
}