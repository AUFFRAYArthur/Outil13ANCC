import { BilanCategory } from "../types";

export const getCategoryFromAccount = (account: string): BilanCategory => {
    const prefix = account.substring(0, 1);
    switch (prefix) {
        case '1': return 'capitaux-propres';
        case '2': return 'actif-immo';
        case '3': return 'actif-circulant'; // Stocks
        case '4': return 'dettes'; // Dettes et certains comptes de tiers
        case '5': return 'tresorerie-actif';
        case '6': return 'dettes'; // Charges, peuvent générer des dettes
        case '7': return 'capitaux-propres'; // Produits, peuvent impacter le résultat
        default: return 'actif-circulant';
    }
};
