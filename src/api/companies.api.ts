import api from './axios';
import type { Company, CompanyForm, Employee, EmployeeForm } from '@/interfaces';

export const companiesApi = {
    // List companies
    async listCompanies(): Promise<Company[]> {
        const response = await api.get<Company[]>('/companies');
        return response.data.map((company: any) => ({
            id: company.id,
            name: company.name,
            description: company.description || '',
            cnpj: company.cnpj,
            phone: company.phone,
            email: company.email,
            address: company.address,
            status: company.status,
        }));
    },

    // Search for Company by id
    async searchCompany(id: number): Promise<Company> {
        const response = await api.get<any>(`/companies/${id}`);
        const company = response.data;
        return {
            id: company.id,
            name: company.name,
            description: company.description || '',
            cnpj: company.cnpj,
            phone: company.phone,
            email: company.email,
            address: company.address,
            status: company.status,
        };
    },

    // Create company
    async createCompany(company: CompanyForm): Promise<Company> {
        const companies = await this.listCompanies();

        const maxId = companies.length > 0
            ? Math.max(...companies.map(c => Number(c.id) || 0))
            : 0;
        const companyWithId = {
            ...company,
            id: String(maxId + 1)
        };

        const response = await api.post<Company>('/companies', companyWithId);

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
    async createEmployee(employee: EmployeeForm): Promise<Employee> {
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