export const useValidation = () => {
    const validateCNPJ = (cnpj: string): boolean => {
        if (!cnpj) return false;
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        if (cleanCNPJ.length !== 14) {
            return false;
        }

        if (/^(\d)\1+$/.test(cleanCNPJ)) {
            return false;
        }
        let sum = 0;
        let weight = 5;

        for (let i = 0; i < 12; i++) {
            sum += parseInt(cleanCNPJ.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
        }

        let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (digit1 !== parseInt(cleanCNPJ.charAt(12))) {
            return false;
        }

        sum = 0;
        weight = 6;

        for (let i = 0; i < 13; i++) {
            sum += parseInt(cleanCNPJ.charAt(i)) * weight;
            weight = weight === 2 ? 9 : weight - 1;
        }

        let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

        if (digit2 !== parseInt(cleanCNPJ.charAt(13))) {
            return false;
        }

        return true;
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    };

    return {
        validateCNPJ,
        validateEmail,
        validatePhone
    };
};