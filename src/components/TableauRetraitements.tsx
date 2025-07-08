import { BilanItem, Adjustment } from '../types';
import { AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Checkbox } from './ui/Checkbox';

interface Props {
  bilan: BilanItem[];
  isLocked: boolean;
  getAdjustmentFor: (id: string) => Adjustment;
  updateAdjustment: (id: string, revaluedValue: number | null, justification: string, applyDeferredTax: boolean) => void;
  updateBilanItemValue: (id: string, newValue: number) => void;
}

// Formatter for read-only currency display in the "Écart" column
const formatCurrency = (num: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

// Formatter for editable number inputs
const formatForInput = (value: number | null | ''): string => {
  if (value === null || value === '' || isNaN(Number(value))) {
    return '';
  }
  return new Intl.NumberFormat('fr-FR').format(Number(value));
};

// Parser for editable number inputs
const parseFromInput = (value: string): number | null => {
  if (value.trim() === '') {
    return null;
  }
  // Remove formatting spaces (regular and non-breaking)
  const cleaned = value.replace(/[\s\u00A0]/g, '');
  // Check if the cleaned string is a valid integer (allows leading minus)
  if (/^-?\d+$/.test(cleaned)) {
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  }
  // Return null if invalid characters are present
  return null;
};


export const TableauRetraitements = ({ bilan, isLocked, getAdjustmentFor, updateAdjustment, updateBilanItemValue }: Props) => {
  
  const renderRow = (item: BilanItem) => {
    const adjustment = getAdjustmentFor(item.id);
    const revaluedValue = adjustment.revaluedValue;
    
    let ecart = 0;
    if (adjustment.revaluedValue !== null) {
        ecart = adjustment.revaluedValue - item.value;
    }
    
    const isAdjusted = adjustment.revaluedValue !== null;

    const ecartColor = ecart > 0 ? 'text-success' : ecart < 0 ? 'text-error' : 'text-text-secondary';
    const ecartSign = ecart > 0 ? '+' : '';

    const inputClasses = "w-full bg-surface border border-border rounded-md p-2 text-right focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed";

    return (
      <motion.tr 
        key={item.id} 
        className="border-b border-border hover:bg-surface transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <td className="p-4">
          <div className="flex items-center gap-2">
            {item.isFictif && <AlertTriangle size={16} className="text-warning" title="Actif Fictif" />}
            {item.label}
          </div>
        </td>
        <td className="p-4">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Valeur"
            disabled={isLocked}
            value={formatForInput(item.value)}
            onChange={(e) => {
              const rawValue = e.target.value;
              const parsedValue = parseFromInput(rawValue);
              if (parsedValue !== null) {
                updateBilanItemValue(item.id, parsedValue);
              } else if (rawValue.trim() === '') {
                updateBilanItemValue(item.id, 0);
              }
              // For invalid input, do nothing; the value will revert on re-render.
            }}
            className={inputClasses}
          />
        </td>
        <td className="p-4">
          {item.isFictif ? (
            <div className="flex items-center justify-end gap-2 text-warning">
              <span>Neutralisé</span>
              <Info size={14} title="Cet actif est considéré comme fictif et sa valeur est automatiquement déduite." />
            </div>
          ) : (
            <input
              type="text"
              inputMode="decimal"
              placeholder="Valeur"
              disabled={isLocked}
              value={formatForInput(revaluedValue)}
              onChange={(e) => {
                const rawValue = e.target.value;
                const parsedValue = parseFromInput(rawValue);
                if (parsedValue !== null) {
                  updateAdjustment(item.id, parsedValue, adjustment.justification, adjustment.applyDeferredTax);
                } else if (rawValue.trim() === '') {
                  updateAdjustment(item.id, null, adjustment.justification, adjustment.applyDeferredTax);
                }
                // For invalid input, do nothing.
              }}
              className={inputClasses}
            />
          )}
        </td>
        <td className={`p-4 text-right font-mono ${ecartColor}`}>
          {isAdjusted || item.isFictif ? `${ecartSign}${formatCurrency(item.isFictif ? -item.value : ecart)}` : '—'}
        </td>
        <td className="p-4 text-center">
          <Checkbox
            checked={adjustment.applyDeferredTax}
            disabled={isLocked}
            onChange={(e) => updateAdjustment(item.id, adjustment.revaluedValue, adjustment.justification, e.target.checked)}
            title={adjustment.applyDeferredTax ? "Exclure du calcul de l'impôt différé" : "Inclure dans le calcul de l'impôt différé"}
          />
        </td>
        <td className="p-4">
          <input
            type="text"
            placeholder="Justification..."
            disabled={isLocked}
            value={adjustment.justification}
            onChange={(e) => updateAdjustment(item.id, adjustment.revaluedValue, e.target.value, adjustment.applyDeferredTax)}
            className="w-full bg-surface border border-border rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </td>
      </motion.tr>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Tableau des Retraitements</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-fixed">
          <thead className="border-b border-border text-text-secondary">
            <tr>
              <th className="p-4 font-semibold w-1/4">Élément</th>
              <th className="p-4 font-semibold text-center w-[180px]">Valeur Comptable</th>
              <th className="p-4 font-semibold text-center w-[180px]">Valeur Réévaluée</th>
              <th className="p-4 font-semibold text-right w-[180px]">Écart (+/-)</th>
              <th className="p-4 font-semibold text-center w-[120px]">Impôt Différé</th>
              <th className="p-4 font-semibold w-1/4">Notes et Justificatifs</th>
            </tr>
          </thead>
          <tbody>
            {bilan.map(renderRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
};
