export interface Employee {
    id: number;
    name: string;
    email: string;
    position: string;
}

export interface Company {
    id: number;
    name: string;
    description?: string;
    cnpj: string;
    phone?: string;
    email?: string;
    address?: string;
    status: 'ativa' | 'inativa';
}

export interface CompanyForm {
    name: string;
    description?: string;
    cnpj: string;
    phone?: string;
    email?: string;
    address?: string;
    status?: 'ativa' | 'inativa';
}

export interface EmployeeForm {
    companyId: number;
    name: string;
    email: string;
    phone: string;
    position: string;
}