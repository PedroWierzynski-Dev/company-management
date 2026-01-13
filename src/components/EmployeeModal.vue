<template>
    <div class="modal-overlay" @click="$emit('close')">
        <div class="modal" @click.stop>
            <div class="modal-header">
                <h3>Adicionar Funcionário</h3>
            </div>

            <form @submit.prevent="handleSubmit" class="modal-body">
                <div class="form-group">
                    <label for="name">Nome *</label>
                    <input
                        id="name"
                        v-model="form.name"
                        type="text"
                        required
                        placeholder="Nome completo"
                        :class="{ 'input-error': errors.name }"
                    />
                    <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                    <label for="email">Email *</label>
                    <input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        placeholder="email@empresa.com.br"
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
                        placeholder="(00) 00000-0000"
                        @input="onPhoneInput"
                        :class="{ 'input-error': errors.phone }"
                    />
                    <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                </div>

                <div class="form-group">
                    <label for="position">Cargo *</label>
                    <input
                        id="position"
                        v-model="form.position"
                        type="text"
                        required
                        placeholder="Ex: Desenvolvedor"
                        :class="{ 'input-error': errors.position }"
                    />
                    <span v-if="errors.position" class="error-text">{{ errors.position }}</span>
                </div>
                <Toast v-if="errorMessage" type="error" :message="errorMessage" />

                <div class="modal-actions">
                    <Button variant="secondary" @click="$emit('close')" :disabled="loading">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="success" :loading="loading">
                        Adicionar
                    </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from 'vue';
    import { companiesApi } from '@/api/companies.api';
    import { useMask } from '@/composables/useMask';
    import { useValidation } from '@/composables/useValidation'; 
    import Button from './Button.vue';
    import Toast from './Toast.vue';

    interface Props {
        companyId: number;
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{
        close: [];
        success: [];
    }>();

    const { onPhoneInput, unmask } = useMask();
    const { validateEmail } = useValidation();

    const form = reactive({
        name: '',
        email: '',
        phone: '',
        position: ''
    });

    const errors = reactive({
        name: '',
        email: '',
        phone: '',
        position: ''
    });

    const loading = ref(false);
    const errorMessage = ref('');

    const validateForm = (): boolean => {
        let valid = true;
        
        errors.name = '';
        errors.email = '';
        errors.phone = '';
        errors.position = '';

        if (!form.name || form.name.length < 3) {
            errors.name = 'Nome deve ter no mínimo 3 caracteres';
            valid = false;
        }

            if (!validateEmail(form.email)) {
            errors.email = 'Email inválido';
            valid = false;
        }

        if (!form.position || form.position.length < 2) {
            errors.position = 'Cargo deve ter no mínimo 2 caracteres';
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async () => {
        errorMessage.value = '';
        
        if (!validateForm()) {
            return;
        }

        loading.value = true;

        try {
            await companiesApi.createEmployee({
            companyId: props.companyId,
            name: form.name,
            email: form.email,
            phone: unmask(form.phone),
            position: form.position
            });

            emit('success');
            emit('close');
        } catch (err) {
            errorMessage.value = 'Erro ao adicionar funcionário. Tente novamente.';
            console.error(err);
        } finally {
            loading.value = false;
        }
    };
</script>