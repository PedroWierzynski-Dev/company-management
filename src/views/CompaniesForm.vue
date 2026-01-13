<template>
    <div class="container">
        <div class="header">
            <h1>{{ isEdit ? 'Editar Empresa' : 'Nova Empresa' }}</h1>
            <router-link to="/" class="btn btn-secondary">
                ← Voltar
            </router-link>
        </div>

        <!-- Loading -->
        <Loader v-if="loading" :message="isEdit ? 'Carregando dados...' : 'Salvando...'" />
        
        <!-- Formulário -->
        <form v-else @submit.prevent="saveCompany" class="form">

            <Toast v-if="errorMessage" type="error" :message="errorMessage" />
            <Toast v-if="successMessage" type="success" :message="successMessage" />

            <div class="grid grid-2 card mb-3">
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
                        @input="onCNPJInput"
                        :class="{ 'input-error': errors.cnpj }"
                    />
                    <span v-if="errors.cnpj" class="error-text">{{ errors.cnpj }}</span>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        placeholder="contato@empresa.com"
                        :class="{ 'input-error': errors.email }"
                    />
                    <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                    <label for="phone">Telefone</label>
                    <input
                        id="phone"
                        v-model="form.phone"
                        type="text"
                        placeholder="(00) 0000-0000"
                        @input="onPhoneInput"
                        :class="{ 'input-error': errors.phone }"
                    />
                    <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                </div>

                <div class="form-group">
                    <label for="address">Endereço</label>
                    <input
                        id="address"
                        v-model="form.address"
                        type="text"
                        placeholder="Rua, número, cidade"
                    />
                </div>

                <div class="form-group">
                    <label for="status">Status *</label>
                    <select id="status" v-model="form.status" required>
                        <option value="ativa">Ativa</option>
                        <option value="inativa">Inativa</option>
                    </select>
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

                
            </div>

            <div class="form-actions">
                <router-link to="/" class="btn btn-danger">
                Cancelar
                </router-link>
                <Button type="submit" variant="success" :loading="loading">
                    {{ isEdit ? 'Salvar Alterações' : 'Cadastrar Empresa' }}
                </Button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { companiesApi } from '@/api/companies.api';
import type { CompanyForm } from '@/interfaces';
import { useMask } from '@/composables/useMask';
import { useValidation } from '@/composables/useValidation';
import Loader from '@/components/Loader.vue';
import Toast from '@/components/Toast.vue';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter();
const { onCNPJInput, onPhoneInput, unmask } = useMask();
const { validateCNPJ } = useValidation();

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

    if (!validateCNPJ(form.cnpj)) {
        errors.cnpj = 'CNPJ inválido';
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
        errors.email = 'Email inválido';
        valido = false;
    }

    return valido;
};

const loadCompany = async () => {
    const id = Number(route.params.id);
    if (!id) return;

    loading.value = true;
    try {
        const company = await companiesApi.searchCompany(id);
        
        form.name = company.name;
        form.cnpj = company.cnpj || '';
        form.email = company.email || '';
        form.phone = company.phone || '';
        form.address = company.address || '';
        form.description = company.description || '';
        form.status = company.status || 'ativa';
    } catch (err) {
        if (err.response?.status === 500) {
            errorMessage.value = 'Erro no servidor. Tente novamente mais tarde.';
        } else {
            errorMessage.value = 'Aconteceu algo inesperado, tente novamente mais tarde';
        }
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
        const companyData: CompanyForm = {
            ...form,
            cnpj: unmask(form.cnpj),      // Remove máscara do CNPJ
            phone: unmask(form.phone || '') // Remove máscara do telefone
        };
        if (isEdit.value) {
            const id = Number(route.params.id);
            await companiesApi.updateCompany(id, companyData);
            successMessage.value = 'Empresa atualizada com sucesso!';
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } else {
            const createdCompany = await companiesApi.createCompany(companyData);
            successMessage.value = 'Empresa cadastrada com sucesso!';
            setTimeout(() => {
                router.push('/');
            }, 1500);
        }
    } catch (err) {
        if (err.response?.status === 400) {
            errorMessage.value = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (err.response?.status === 409) {
            errorMessage.value = 'Esta empresa já está cadastrada.';
        } else if (err.response?.status === 500) {
            errorMessage.value = 'Erro no servidor. Tente novamente mais tarde.';
        } else if (!navigator.onLine) {
            errorMessage.value = 'Sem conexão com a internet. Verifique sua conexão.';
        } else {
            errorMessage.value = 'Aconteceu algo inesperado, tente novamente mais tarde';
        }
        console.error('Erro ao salvar empresa:', err);
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
