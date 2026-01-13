import { createRouter, createWebHistory } from 'vue-router';
import CompaniesList from '@/views/CompaniesList.vue';
import CompaniesForm from '@/views/CompaniesForm.vue';
import EmpresaDetalhes from '@/views/CompanyDetail.vue';

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'empresas-list',
            component: CompaniesList,
            meta: {
                title: 'Empresas - Listagem'
            }
        },
        {
            path: '/companies/new',
            name: 'empresas-nova',
            component: CompaniesForm,
            meta: {
                title: 'Nova Empresa'
            }
        },
        {
            path: '/companies/:id',
            name: 'empresas-detalhes',
            component: EmpresaDetalhes,
            meta: {
                title: 'Detalhes da Empresa'
            }
        },
        {
            path: '/companies/:id/edit',
            name: 'empresas-editar',
            component: CompaniesForm,
            meta: {
                title: 'Editar Empresa'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
});

// Atualizar título da página
router.beforeEach((to, from, next) => {
    document.title = (to.meta.title as string) || 'Gerenciamento de Empresas';
    next();
});

export default router;