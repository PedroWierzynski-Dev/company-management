<template>
    <div class="empresa-detalhes-container">
        <div class="detalhes-header">
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
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Carregando informações...</p>
        </div>

        <!-- Erro -->
        <div v-else-if="error" class="error-message">
            <p>❌ {{ error }}</p>
            <button @click="loadData" class="btn btn-secondary">
                Tentar Novamente
            </button>
        </div>

        <!-- Conteúdo -->
        <div v-else class="detalhes-content">
            <!-- Card da Empresa -->
            <div class="empresa-card">
                <div class="card-header">
                    <h2>{{ company?.name }}</h2>
                    <span class="status-badge" :class="company?.status">
                        {{ company?.status === 'ativa' ? '✓ Ativa' : '⊗ Inativa' }}
                    </span>
                </div>

                <div class="empresa-info-grid">
                    <div class="info-item">
                        <span class="info-label">CNPJ:</span>
                        <span class="info-value">{{ formatCnpj(company?.cnpj) }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">{{ company?.email }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Telefone:</span>
                        <span class="info-value">{{ company?.phone }}</span>
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

            <!-- Card dos Usuários -->
            <div class="usuarios-card">
                <div class="card-header">
                    <h2>Usuários Vinculados</h2>
                    <span class="badge">{{ employees.length }} usuário(s)</span>
                </div>

                <!-- Loading usuários -->
                <div v-if="loadingEmployees" class="loading-small">
                    <div class="spinner-small"></div>
                    <p>Carregando usuários...</p>
                </div>

                <!-- Lista de usuários -->
                <div v-else-if="employees.length > 0" class="usuarios-list">
                    <div
                        v-for="employee in employees"
                        :key="employee.id"
                        class="usuario-item"
                    >
                        <div class="usuario-avatar">
                            {{ employee.name.charAt(0).toUpperCase() }}
                            </div>
                            <div class="usuario-info">
                            <h4>{{ employee.name }}</h4>
                            <p class="usuario-email">{{ employee.email }}</p>
                            <p class="usuario-phone">{{ employee.position }}</p>
                        </div>
                    </div>
                </div>

                <!-- Sem usuários -->
                <div v-else class="empty-state">
                    <p>Nenhum usuário vinculado a esta empresa</p>
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

    const route = useRoute();

    const company = ref<Company | null>(null);
    const employees = ref<Employee[]>([]);
    const loading = ref(false);
    const loadingEmployees = ref(false);
    const error = ref<string | null>(null);

    const companyId = computed(() => Number(route.params.id));

    const formatCnpj = (cnpj: string | undefined): string => {
        if (!cnpj) return 'N/A';
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

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

    onMounted(() => {
        loadData();
    });
</script>

<style scoped>
.empresa-detalhes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.detalhes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.detalhes-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
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

.detalhes-content {
  display: grid;
  gap: 2rem;
}

.empresa-card,
.usuarios-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #ecf0f1;
}

.card-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.ativa {
  background: #d4edda;
  color: #155724;
}

.status-badge.inativa {
  background: #f8d7da;
  color: #721c24;
}

.badge {
  background: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.empresa-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #2c3e50;
  font-size: 1.1rem;
}

.info-value.italic {
  font-style: italic;
  color: #555;
}

.loading-small {
  text-align: center;
  padding: 2rem;
}

.spinner-small {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

.usuarios-list {
  display: grid;
  gap: 1rem;
}

.usuario-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s;
}

.usuario-item:hover {
  transform: translateX(4px);
  background: #e9ecef;
}

.usuario-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
}

.usuario-info {
  flex: 1;
}

.usuario-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.usuario-info p {
  margin: 0.25rem 0;
  color: #555;
  font-size: 0.9rem;
}

.usuario-email {
  color: #3498db !important;
}

.usuario-phone,
.usuario-website {
  color: #7f8c8d !important;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .detalhes-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .empresa-info-grid {
    grid-template-columns: 1fr;
  }

  .usuario-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>