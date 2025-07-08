export type BilanCategory = 'actif-immo' | 'actif-circulant' | 'tresorerie-actif' | 'capitaux-propres' | 'dettes' | 'hors-bilan';

export interface BilanItem {
  id: string;
  label: string;
  category: BilanCategory;
  value: number;
  isFictif?: boolean;
  applyDeferredTax?: boolean;
}

export interface Adjustment {
  revaluedValue: number | null;
  justification: string;
  applyDeferredTax: boolean;
}

export type Adjustments = Record<string, Adjustment>;

export interface AnccResult {
  anc: number;
  totalActif: number;
  totalPassif: number;
  totalPlusValues: number;
  totalMinusValues: number;
  netAdjustments: number;
  impotDiffere: number;
  ancc: number;
}

export interface CsvRow {
    COMPTE: string;
    LIBELLE: string;
    DEBIT: string;
    CREDIT: string;
    ANNEE: string;
}
