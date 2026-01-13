<template>
    <div class="container">
        <div class="header">
            <h1>Gerenciamento de Empresas</h1>
            <router-link to="/companies/new" class="btn btn-primary">
                + Nova Empresa
            </router-link>
        </div>

        <!-- Loading -->
        <Loader v-if="loading" message="Carregando empresas..." />

        <!-- Error -->
        <Toast v-else-if="error" type="error" :message="error">
            <Button variant="secondary" @click="loadCompanies">Tentar Novamente</Button>
        </Toast>

        <div v-else class="grid grid-2">
            <div v-for="company in companiesPagination" 
                :key="company.id" class="card" 
                :class="{ inativa: company.status === 'inativa' }"
            >
                <div class="card-header">
                    <h3>{{ company.name }}</h3>
                    <span class="status-badge" :class="company.status">
                        {{ company.status === 'ativa' ? 'Ativa' : 'Inativa' }}
                    </span>
                </div>

                <div class="company-info">
                    <p><strong>CNPJ:</strong> {{ maskCNPJ(company.cnpj) }}</p>
                    <p><strong>Email:</strong> {{ company.email }}</p>
                    <p><strong>Telefone:</strong> {{maskPhone(company.phone) }}</p>
                    <p class="description">{{ company.description }}</p>
                </div>

                <div class="flex flex-between">
                    <router-link :to="`/companies/${company.id}`" class="btn btn-info">
                        Detalhes
                    </router-link>
                    <router-link :to="`/companies/${company.id}/edit`"class="btn btn-secondary">
                        Editar
                    </router-link>
                    <Button 
                        variant="danger" 
                        size="small"
                        @click="confirmDelete(company)"
                    >
                        Excluir
                    </Button>
                </div>
            </div>
        </div>

        <div class="flex flex-center flex-column flex-gap-md mt-4">
            <div class="pagination" v-if="totalPages > 1">
                <button 
                class="pagination-button" 
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                >
                ← Anterior
                </button>
                
                <button
                v-for="page in totalPages"
                :key="page"
                class="pagination-button"
                :class="{ active: page === currentPage }"
                @click="changePage(page)"
                >
                {{ page }}
                </button>

                <button 
                class="pagination-button" 
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
                >
                Próxima →
                </button>
            </div>

            <p class="pagination-info">
                Mostrando {{ companiesPagination.length }} de {{ companies.length }} empresas
            </p>
        </div>

        <!-- Modal de Confirmação -->
        <div v-if="companyToDelete" class="modal-overlay" @click="cancelDelete">
            <div class="modal" @click.stop>
                <h3>Confirmar Exclusão</h3>
                <p>Deseja realmente excluir a empresa <strong>{{ companyToDelete.name }}</strong>?</p>
                <div class="modal-actions mt-3">
                    <Button variant="secondary" @click="cancelDelete">
                        Cancelar
                    </Button>
                    <Button variant="danger" @click="deleteCompany" :loading="deletingCompany">
                        Excluir
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { companiesApi } from '@/api/companies.api';
    import type { Company } from '@/interfaces';
    import { useMask } from '@/composables/useMask';
    import Loader from '@/components/Loader.vue';
    import Toast from '@/components/Toast.vue';
    import Button from '@/components/Button.vue';

    const companies = ref<Company[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const companyToDelete = ref<Company | null>(null);
    const { maskCNPJ, maskPhone } = useMask();
    const deletingCompany = ref(false);

    const currentPage = ref(1);
    const itemsPerPage = 4;
    

    const loadCompanies = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            companies.value = await companiesApi.listCompanies();
        } catch (err) {
            error.value = 'Erro ao carregar companies. Tente novamente.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const totalPages = computed(() => {
        return Math.ceil(companies.value.length / itemsPerPage);
    });

    const companiesPagination = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return companies.value.slice(start, end);
    });

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const confirmDelete = (empresa: Company) => {
        companyToDelete.value = empresa;
    };

    const cancelDelete = () => {
        companyToDelete.value = null;
    };

    const deleteCompany = async () => {
        if (!companyToDelete.value) return;

        try {
            await companiesApi.deleteCompany(companyToDelete.value.id);
            companies.value = companies.value.filter(
            (e) => e.id !== companyToDelete.value!.id
            );
            companyToDelete.value = null;
        } catch (err) {
            error.value = 'Erro ao excluir empresa.';
            console.error(err);
        }
    };

    onMounted(() => {
        loadCompanies();
    });
</script>
