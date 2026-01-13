<template>
  <div class="empresas-list">
    <div class="header">
      <h1>Gerenciamento de Empresas</h1>
      <router-link to="/companies/new" class="btn btn-primary">
        + Nova Empresa
      </router-link>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando empresas...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="error-message">
      <p>❌ {{ error }}</p>
      <button @click="loadCompanies" class="btn btn-secondary">
        Tentar Novamente
      </button>
    </div>

    <!-- Lista de Empresas -->
    <div v-else class="empresas-grid">
      <div
        v-for="company in companies"
        :key="company.id"
        class="empresa-card"
        :class="{ inativa: company.status === 'inativa' }"
      >
        <div class="empresa-header">
          <h3>{{ company.name }}</h3>
          <span class="status-badge" :class="company.status">
            {{ company.status === 'ativa' ? 'Ativa' : 'Inativa' }}
          </span>
        </div>

        <div class="empresa-info">
          <p><strong>CNPJ:</strong> {{ formatCnpj(company.cnpj) }}</p>
          <p><strong>Email:</strong> {{ company.email }}</p>
          <p><strong>Telefone:</strong> {{ company.phone }}</p>
          <p class="description">{{ company.description }}</p>
        </div>

        <div class="empresa-actions">
          <router-link
            :to="`/companies/${company.id}`"
            class="btn btn-info"
          >
            Detalhes
          </router-link>
          <router-link
            :to="`/companies/${company.id}/edit`"
            class="btn btn-secondary"
          >
            Editar
          </router-link>
          <button
            @click="confirmDelete(company)"
            class="btn btn-danger"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="companyToDelete" class="modal-overlay" @click="cancelDelete">
      <div class="modal" @click.stop>
        <h3>Confirmar Exclusão</h3>
        <p>Deseja realmente excluir a empresa <strong>{{ companyToDelete.name }}</strong>?</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn btn-secondary">
            Cancelar
          </button>
          <button @click="deleteCompany" class="btn btn-danger">
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import { companiesApi } from '@/api/companies.api';
    import type { Company } from '@/interfaces';

    const companies = ref<Company[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const companyToDelete = ref<Company | null>(null);

    const loadCompanies = async () => {
        loading.value = true;
        error.value = null;
        
        try {
            companies.value = await companiesApi.listCompanies();
        } catch (err) {
            error.value = 'Erro ao carregar empresas. Tente novamente.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    const formatCnpj = (cnpj: string | undefined): string => {
        if (!cnpj) return 'N/A';
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
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

<style scoped>
.empresas-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-info {
  background: #1abc9c;
  color: white;
}

.btn-info:hover {
  background: #16a085;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: #ffe6e6;
  border-radius: 8px;
  color: #c0392b;
}

.empresas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.empresa-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.empresa-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.empresa-card.inativa {
  opacity: 0.7;
  background: #f8f9fa;
}

.empresa-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.empresa-header h3 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.25rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.ativa {
  background: #d4edda;
  color: #155724;
}

.status-badge.inativa {
  background: #f8d7da;
  color: #721c24;
}

.empresa-info {
  margin-bottom: 1.5rem;
}

.empresa-info p {
  margin: 0.5rem 0;
  color: #555;
  font-size: 0.9rem;
}

.empresa-info .catchphrase {
  font-style: italic;
  color: #7f8c8d;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.empresa-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.empresa-actions .btn {
  flex: 1;
  min-width: 80px;
  text-align: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal h3 {
  margin-top: 0;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions .btn {
  flex: 1;
}
</style>