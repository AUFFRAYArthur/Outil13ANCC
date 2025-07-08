import { useState } from 'react';
import { BilanItem, Adjustment, BilanCategory } from '../types';
import { AlertTriangle, Info, FilePenLine, Trash2, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Checkbox } from './ui/Checkbox';
import { Tooltip } from './ui/Tooltip';
import { AddItemModal } from './AddItemModal';
import { JustificationModal } from './JustificationModal';

interface Props {
  bilan: BilanItem[];
  isLocked: boolean;
  getAdjustmentFor: (id: string) => Adjustment;
  updateAdjustment: (id: string, revaluedValue: number | null, justification: string, applyDeferredTax: boolean) => void;
  updateBilanItemValue: (id: string, newValue: number) => void;
  addBilanItem: (label: string, category: BilanCategory, value: number) => void;
  deleteBilanItem: (id: string) => void;
}

const formatCurrency = (num: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
const formatForInput = (value: number | null | ''): string => {
  if (value === null || value === '' || isNaN(Number(value))) return '';
  return new Intl.NumberFormat('fr-FR', { useGrouping: true }).format(Number(value));
};
const parseFromInput = (value: string): number | null => {
  if (value.trim() === '') return null;
  const cleaned = value.replace(/[\s\u00A0]/g, '').replace(',', '.');
  if (/^-?\d*\.?\d+$/.test(cleaned)) {
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  }
  return null;
};

export const TableauRetraitements = ({ bilan, isLocked, getAdjustmentFor, updateAdjustment, updateBilanItemValue, addBilanItem, deleteBilanItem }: Props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingJustificationItem, setEditingJustificationItem] = useState<BilanItem | null>(null);

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le poste "${label}" ?`)) {
      deleteBilanItem(id);
    }
  };

  const handleSaveJustification = (justification: string) => {
    if (!editingJustificationItem) return;
    const adj = getAdjustmentFor(editingJustificationItem.id);
    updateAdjustment(editingJustificationItem.id, adj.revaluedValue, justification, adj.applyDeferredTax);
  };

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
        className="border-b border-border hover:bg-surface transition-colors group"
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
              const parsedValue = parseFromInput(e.target.value);
              if (parsedValue !== null) updateBilanItemValue(item.id, parsedValue);
              else if (e.target.value.trim() === '') updateBilanItemValue(item.id, 0);
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
                const parsedValue = parseFromInput(e.target.value);
                updateAdjustment(item.id, parsedValue, adjustment.justification, adjustment.applyDeferredTax);
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
            disabled={isLocked || item.isFictif}
            onCheckedChange={(checked) => updateAdjustment(item.id, adjustment.revaluedValue, adjustment.justification, !!checked)}
            title={adjustment.applyDeferredTax ? "Exclure du calcul de l'impôt différé" : "Inclure dans le calcul de l'impôt différé"}
          />
        </td>
        <td className="p-4">
          <div className="flex items-center justify-center gap-2">
            {adjustment.justification && (
              <Tooltip content={adjustment.justification}>
                <Info size={16} className="text-sky-400" />
              </Tooltip>
            )}
            <button
              onClick={() => setEditingJustificationItem(item)}
              disabled={isLocked}
              className="text-text-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              title="Modifier la justification"
            >
              <FilePenLine size={16} />
            </button>
            <button
              onClick={() => handleDelete(item.id, item.label)}
              disabled={isLocked}
              className="text-text-secondary hover:text-error disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity"
              title="Supprimer le poste"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </motion.tr>
    );
  };

  const itemsToRestate = bilan.filter(item => item.category !== 'capitaux-propres');

  return (
    <>
      <AddItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddItem={addBilanItem} />
      <JustificationModal 
        item={editingJustificationItem}
        adjustment={editingJustificationItem ? getAdjustmentFor(editingJustificationItem.id) : null}
        onClose={() => setEditingJustificationItem(null)}
        onSave={handleSaveJustification}
      />
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Tableau des Retraitements</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            disabled={isLocked}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle size={16} />
            Ajouter un poste
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-fixed">
            <thead className="border-b border-border text-text-secondary">
              <tr>
                <th className="p-4 font-semibold w-1/4">Élément</th>
                <th className="p-4 font-semibold text-center w-[180px]">Valeur Comptable</th>
                <th className="p-4 font-semibold text-center w-[180px]">Valeur Réévaluée</th>
                <th className="p-4 font-semibold text-right w-[180px]">Écart (+/-)</th>
                <th className="p-4 font-semibold text-center w-[120px]">Impôt Différé</th>
                <th className="p-4 font-semibold text-center w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemsToRestate.map(renderRow)}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
