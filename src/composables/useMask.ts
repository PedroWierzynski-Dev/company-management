export const useMask = () => {
    const maskCNPJ = (value: string): string => {
        if (!value) return '';

        let cnpj = value.replace(/\D/g, '');

        cnpj = cnpj.substring(0, 14);

        cnpj = cnpj.replace(/(\d{2})(\d)/, '$1.$2');
        cnpj = cnpj.replace(/(\d{3})(\d)/, '$1.$2');
        cnpj = cnpj.replace(/(\d{3})(\d)/, '$1/$2');
        cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');

        return cnpj;
    };

    const maskPhone = (value: string): string => {
        if (!value) return '';

        let phone = value.replace(/\D/g, '');
        phone = phone.substring(0, 11);

        if (phone.length <= 10) {
            phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
            phone = phone.replace(/(\d{4})(\d)/, '$1-$2');
        } else {
            phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
            phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
        }

        return phone;
    };

    const unmask = (value: string): string => {
        if (!value) return '';
        return value.replace(/\D/g, '');
    };

    const onCNPJInput = (event: Event) => {
        const input = event.target as HTMLInputElement;
        input.value = maskCNPJ(input.value);
    };

    const onPhoneInput = (event: Event) => {
        const input = event.target as HTMLInputElement;
        input.value = maskPhone(input.value);
    };

    return {
        maskCNPJ,
        maskPhone,
        unmask,
        onCNPJInput,
        onPhoneInput
    };
};