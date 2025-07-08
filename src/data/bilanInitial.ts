import { BilanItem } from '../types';

export const bilanInitialData: BilanItem[] = [
  // Actifs
  { id: 'frais-etablissement', label: "Frais d'établissement", category: 'actif-immo', value: 15000, isFictif: true, applyDeferredTax: false },
  { id: 'fonds-commerce', label: 'Fonds de commerce', category: 'actif-immo', value: 120000, applyDeferredTax: true },
  { id: 'terrains', label: 'Terrains', category: 'actif-immo', value: 250000, applyDeferredTax: true },
  { id: 'constructions', label: 'Constructions', category: 'actif-immo', value: 450000, applyDeferredTax: true },
  { id: 'materiel-industriel', label: 'Matériel industriel', category: 'actif-immo', value: 180000, applyDeferredTax: true },
  { id: 'stocks', label: 'Stocks de marchandises', category: 'actif-circulant', value: 95000, applyDeferredTax: false },
  { id: 'creances-clients', label: 'Créances clients', category: 'actif-circulant', value: 75000, applyDeferredTax: false },
  { id: 'vmp', label: 'Valeurs Mobilières de Placement', category: 'tresorerie-actif', value: 50000, applyDeferredTax: true },
  { id: 'disponibilites', label: 'Disponibilités', category: 'tresorerie-actif', value: 110000, applyDeferredTax: false },

  // Passifs
  { id: 'capital-social', label: 'Capital social', category: 'capitaux-propres', value: 300000, applyDeferredTax: false },
  { id: 'reserves', label: 'Réserves', category: 'capitaux-propres', value: 220000, applyDeferredTax: false },
  { id: 'resultat-exercice', label: "Résultat de l'exercice", category: 'capitaux-propres', value: 85000, applyDeferredTax: false },
  { id: 'provisions-risques', label: 'Provisions pour risques', category: 'dettes', value: 40000, applyDeferredTax: false },
  { id: 'dettes-financieres', label: 'Dettes financières', category: 'dettes', value: 350000, applyDeferredTax: false },
  { id: 'dettes-fournisseurs', label: 'Dettes fournisseurs', category: 'dettes', value: 50000, applyDeferredTax: false },

  // Engagements hors bilan
  { id: 'ifc', label: 'Engagement hors bilan (IFC)', category: 'hors-bilan', value: 0, applyDeferredTax: false },
];
