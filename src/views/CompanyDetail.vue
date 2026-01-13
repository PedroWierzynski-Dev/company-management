<template>
    <div class="container">
        <div class="header">
            <h1>Detalhes da Empresa</h1>
            <div class="header-actions">
                <router-link :to="`/companies/${companyId}/edit`" class="btn btn-primary">
                    Editar
                </router-link>
                <router-link to="/" class="btn btn-secondary">
                    Voltar
                </router-link>
            </div>
        </div>

        <!-- Loading -->
        <Loader v-if="loading" message="Carregando informações..." />

        <!-- Erro -->
        <Toast v-else-if="error" type="error" :message="error">
            <Button variant="secondary" @click="loadData">Tentar Novamente</Button>
        </Toast>

        <div v-else class="content">
            <div class="card">
                <div class="card-header">
                    <h2>{{ company?.name }}</h2>
                    <span class="status-badge" :class="company?.status">
                        {{ company?.status === 'ativa' ? '✓ Ativa' : '⊗ Inativa' }}
                    </span>
                </div>

                <div class="empresa-info-grid">
                    <div class="info-item">
                        <span class="info-label">CNPJ:</span>
                        <span class="info-value">{{ maskCNPJ(company?.cnpj) }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{{ company?.email }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Telefone:</span>
                        <span class="info-value">{{maskPhone(company?.phone) }}</span>
                    </div>

                    <div class="info-item full-width">
                        <span class="info-label">Endereço:</span>
                        <span class="info-value">{{ company?.address || 'Não informado' }}</span>
                    </div>

                    <div class="info-item full-width" v-if="company?.description">
                        <span class="info-label">Descrição:</span>
                        <span class="info-value italic">{{ company?.description }}</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h2>Usuários Vinculados</h2>
                    <div class="flex flex-gap-sm">
                        <span class="badge" style="background: #3498db; color: white;">{{ employees.length }} usuário(s)</span>
                        <Button 
                            variant="success" 
                            size="small" 
                            icon="+"
                            @click="showEmployeeModal = true"
                        >
                            Adicionar
                        </Button>
                    </div>
                </div>

                <Loader v-if="loadingEmployees" size="small" message="Carregando funcionários..." />

                <div v-else-if="employees.length > 0" class="employee-list">
                    <div
                        v-for="employee in employees"
                        :key="employee.id"
                        class="employee-item"
                    >
                        <div class="employee-avatar">
                            {{ employee.name.charAt(0).toUpperCase() }}
                            </div>
                            <div class="employee-info">
                            <h4>{{ employee.name }}</h4>
                            <p class="employee-email">{{ employee.email }}</p>
                            <p class="employee-phone">{{ employee.position }}</p>
                        </div>
                        <div class="employee-actions">
                            <Button 
                                variant="danger" 
                                size="small"
                                @click="confirmExclude(employee)"
                            >
                                Excluir
                            </Button>
                        </div>
                    </div>
                </div>

                
                <div v-else class="empty-state">
                    <p>Nenhum funcionário vinculado a esta empresa</p>
                    <Button 
                        variant="primary" 
                        @click="showEmployeeModal = true"
                        style="margin-top: 1rem;"
                    >
                        Adicionar Primeiro Funcionário
                    </Button>
                </div>
            </div>
        </div>

        <!-- Modal Adicionar Funcionário -->
        <EmployeeModal
            v-if="showEmployeeModal"
            :company-id="companyId"
            @close="showEmployeeModal = false"
            @success="handleEmployeeAdded"
        />

        <!-- Modal Confirmar Exclusão -->
        <div v-if="employeeToExclude" class="modal-overlay" @click="cancelExclude">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h3>Confirmar Exclusão</h3>
                </div>
                <div class="modal-body">
                    <p>Deseja realmente excluir o funcionário <strong>{{ employeeToExclude.name }}</strong>?</p>
                </div>
                <div class="modal-actions">
                    <Button variant="secondary" @click="cancelExclude">
                        Cancelar
                    </Button>
                    <Button variant="danger" @click="excludeEmployee" :loading="deletingEmployee">
                        Excluir
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import { companiesApi } from '@/api/companies.api';
    import type { Company, Employee } from '@/interfaces';
    import Loader from '@/components/Loader.vue';
    import Toast from '@/components/Toast.vue';
    import Button from '@/components/Button.vue';
    import EmployeeModal from '@/components/EmployeeModal.vue';
    import { useMask } from '@/composables/useMask';
    

    const route = useRoute();

    const company = ref<Company | null>(null);
    const employees = ref<Employee[]>([]);
    const loading = ref(false);
    const loadingEmployees = ref(false);
    const error = ref<string | null>(null);
    const showEmployeeModal = ref(false);
    const employeeToExclude = ref<Employee | null>(null);
    const deletingEmployee = ref(false);
    const { maskCNPJ, maskPhone } = useMask();


    const companyId = computed(() => Number(route.params.id));

    const loadCompany = async () => {
        loading.value = true;
        error.value = null;

        try {
            company.value = await companiesApi.searchCompany(companyId.value);
        } catch (err) {
            error.value = 'Erro ao carregar dados da empresa';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const loadEmployees = async () => {
        loadingEmployees.value = true;

        try {
            employees.value = await companiesApi.listEmployees(companyId.value);
        } catch (err) {
            console.error('Erro ao carregar usuários:', err);
        } finally {
            loadingEmployees.value = false;
        }
        };

        const loadData = async () => {
        await Promise.all([loadCompany(), loadEmployees()]);
    };

    const handleEmployeeAdded = () => {
        loadEmployees();
    };

    const confirmExclude = (employee: Employee) => {
        employeeToExclude.value = employee;
    };

    const cancelExclude = () => {
        employeeToExclude.value = null;
    };

    const excludeEmployee = async () => {
        if (!employeeToExclude.value) return;

        deletingEmployee.value = true;

        try {
            await companiesApi.deleteEmployee(employeeToExclude.value.id);
            employees.value = employees.value.filter(u => u.id !== employeeToExclude.value!.id);
            employeeToExclude.value = null;
        } catch (err) {
            console.error('Erro ao excluir funcionário:', err);
            alert('Erro ao excluir funcionário. Tente novamente.');
        } finally {
            deletingEmployee.value = false;
        }
    };

    onMounted(() => {
        loadData();
    });
</script>
