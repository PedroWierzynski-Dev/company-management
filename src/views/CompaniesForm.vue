<template>
    <div class="empresa-form-container">
        <div class="form-header">
            <h1>{{ isEdit ? 'Editar Empresa' : 'Nova Empresa' }}</h1>
            <router-link to="/" class="btn btn-secondary">
                ← Voltar
            </router-link>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>{{ isEdit ? 'Carregando dados...' : 'Salvando...' }}</p>
        </div>
        
        <!-- Formulário -->
        <form v-else @submit.prevent="saveCompany" class="empresa-form">

            <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
            </div>

            <div v-if="successMessage" class="success-message">
                {{ successMessage }}
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label for="name">Nome da Empresa *</label>
                    <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        placeholder="Ex: Acme Corporation"
                        :class="{ 'input-error': errors.name }"
                    />
                    <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                    <label for="cnpj">CNPJ *</label>
                    <input
                        id="cnpj"
                        v-model="form.cnpj"
                        type="text"
                        required
                        placeholder="00.000.000/0000-00"
                        maxlength="18"
                        @input="formatCnpjInput"
                        :class="{ 'input-error': errors.cnpj }"
                    />
                    <span v-if="errors.cnpj" class="error-text">{{ errors.cnpj }}</span>
                </div>

                <div class="form-group">
                    <label for="email">Email *</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        placeholder="contato@empresa.com"
                        :class="{ 'input-error': errors.email }"
                    />
                    <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                    <label for="phone">Telefone *</label>
                    <input
                        id="phone"
                        v-model="form.phone"
                        type="text"
                        required
                        placeholder="(00) 0000-0000"
                        :class="{ 'input-error': errors.phone }"
                    />
                    <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                </div>

                <div class="form-group full-width">
                    <label for="address">Endereço</label>
                    <input
                        id="address"
                        v-model="form.address"
                        type="text"
                        placeholder="Rua, número, cidade"
                    />
                </div>

                <div class="form-group full-width">
                    <label for="description">Descrição</label>
                    <textarea
                        id="description"
                        v-model="form.description"
                        rows="3"
                        placeholder="Breve descrição das atividades da empresa"
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="status">Status *</label>
                    <select id="status" v-model="form.status" required>
                        <option value="ativa">Ativa</option>
                        <option value="inativa">Inativa</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <router-link to="/" class="btn btn-secondary">
                Cancelar
                </router-link>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ isEdit ? 'Salvar Alterações' : 'Cadastrar Empresa' }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { companiesApi } from '@/api/companies.api';
import type { CompanyForm } from '@/interfaces';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const form = reactive<CompanyForm>({
  name: '',
  cnpj: '',
  email: '',
  phone: '',
  address: '',
  description: '',
  status: 'ativa',
});

const errors = reactive({
  name: '',
  cnpj: '',
  email: '',
  phone: '',
});

const isEdit = computed(() => !!route.params.id);

const formatCnpjInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let valor = input.value.replace(/\D/g, '');
  
  if (valor.length <= 14) {
    valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
  }
  
  form.cnpj = valor;
};

const validateForm = (): boolean => {
  let valido = true;

  errors.name = '';
  errors.cnpj = '';
  errors.email = '';
  errors.phone = '';

  if (!form.name || form.name.length < 3) {
    errors.name = 'Nome deve ter no mínimo 3 caracteres';
    valido = false;
  }

  const cnpjNumbers = form.cnpj?.replace(/\D/g, '') || '';
  if (cnpjNumbers.length !== 14) {
    errors.cnpj = 'CNPJ deve ter 14 dígitos';
    valido = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Email inválido';
    valido = false;
  }

  if (!form.phone || form.phone.length < 8) {
    errors.phone = 'Telefone inválido';
    valido = false;
  }

  return valido;
};

const loadCompany = async () => {
  const id = Number(route.params.id);
  if (!id) return;

  loading.value = true;
  try {
    const empresa = await companiesApi.searchCompany(id);
    
    form.name = empresa.name;
    form.cnpj = empresa.cnpj || '';
    form.email = empresa.email || '';
    form.phone = empresa.phone || '';
    form.address = empresa.address || '';
    form.description = empresa.description || '';
    form.status = empresa.status || 'ativa';
  } catch (err) {
    errorMessage.value = 'Erro ao carregar dados da empresa';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const saveCompany = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!validateForm()) {
    errorMessage.value = 'Por favor, corrija os erros no formulário';
    return;
  }

  loading.value = true;

  try {
    if (isEdit.value) {
      const id = Number(route.params.id);
      await companiesApi.updateCompany(id, form);
      successMessage.value = 'Empresa atualizada com sucesso!';
    } else {
      await companiesApi.createCompany(form);
      successMessage.value = 'Empresa cadastrada com sucesso!';
    }

    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err) {
    errorMessage.value = 'Erro ao salvar empresa. Tente novamente.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (isEdit.value) {
    loadCompany();
  }
});
</script>

<style scoped>
.empresa-form-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
}

.empresa-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
}

.form-group input.input-error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.error-message {
  padding: 1rem;
  background: #ffe6e6;
  border-left: 4px solid #e74c3c;
  color: #c0392b;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.success-message {
  padding: 1rem;
  background: #d4edda;
  border-left: 4px solid #28a745;
  color: #155724;
  border-radius: 4px;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
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

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>