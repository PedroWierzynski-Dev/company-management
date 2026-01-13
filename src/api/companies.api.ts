import api from './axios';
import type { Company, CompanyForm, Employee } from '@/interfaces';

export const companiesApi = {
    // List companies
    async listCompanies(): Promise<Company[]> {
        const response = await api.get<Company[]>('/companies');
        return response.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            description: user.company?.description || '',
            cnpj: `${Math.floor(Math.random() * 90000000000000) + 10000000000000}`,
            phone: user.phone,
            email: user.email,
            address: `${user.address?.street}, ${user.address?.city}`,
            status: Math.random() > 0.3 ? 'ativa' : 'inativa',
        }));
    },

    // Search for Company by id
    async searchCompany(id: number): Promise<Company> {
        const response = await api.get<any>(`/companies/${id}`);
        const user = response.data;
        return {
        id: user.id,
        name: user.name,
        description: user.company?.description || '',
        cnpj: `${Math.floor(Math.random() * 90000000000000) + 10000000000000}`,
        phone: user.phone,
        email: user.email,
        address: `${user.address?.street}, ${user.address?.city}`,
        status: Math.random() > 0.3 ? 'ativa' : 'inativa',
        };
    },

    // Create company
    async createCompany(company: CompanyForm): Promise<Company> {
        const response = await api.post<Company>('/companies', company);
        return response.data;
    },

    // Update company
    async updateCompany(id: number, company: CompanyForm): Promise<Company> {
        const response = await api.put<Company>(`/companies/${id}`, company);
        return response.data;
    },


    // Delete company
    async deleteCompany(id: number): Promise<void> {
        await api.delete(`/companies/${id}`);
    },

    //List Employees
    async listEmployees(companyId: number): Promise<Employee[]> {
        const response = await api.get<Employee[]>(`/employees?companyId=${companyId}`);
        return response.data;
    },

    // Search employee by ID
    async searchEmployee(id: number): Promise<Employee> {
        const response = await api.get<Employee>(`/employees/${id}`);
        return response.data;
    },

    // Create Employee
    async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
        const response = await api.post<Employee>('/employees', employee);
        return response.data;
    },

    // Update Employee
    async updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee> {
        const response = await api.patch<Employee>(`/employees/${id}`, employee);
        return response.data;
    },

    // Delete Employee
    async deleteEmployee(id: number): Promise<void> {
        await api.delete(`/employees/${id}`);
    },
}