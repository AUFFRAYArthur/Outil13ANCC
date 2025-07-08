import { useState } from 'react';
import { Modal } from './ui/Modal';
import { BilanCategory } from '../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (label: string, category: BilanCategory, value: number) => void;
}

const categoryOptions: { value: BilanCategory; label: string }[] = [
  { value: 'actif-immo', label: 'Actif Immobilisé' },
  { value: 'actif-circulant', label: 'Actif Circulant' },
  { value: 'tresorerie-actif', label: 'Trésorerie Actif' },
  { value: 'dettes', label: 'Dettes' },
  { value: 'hors-bilan', label: 'Hors Bilan' },
];

export const AddItemModal = ({ isOpen, onClose, onAddItem }: AddItemModalProps) => {
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<BilanCategory>('actif-immo');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(value);
    if (label.trim() && !isNaN(numericValue)) {
      onAddItem(label, category, numericValue);
      handleClose();
    }
  };

  const handleClose = () => {
    setLabel('');
    setCategory('actif-immo');
    setValue('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Ajouter un poste au bilan">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-text-secondary mb-1">Libellé</label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full bg-neutral-800 border border-border rounded-md p-2 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Catégorie</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as BilanCategory)}
            className="w-full bg-neutral-800 border border-border rounded-md p-2 text-white focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-text-secondary mb-1">Valeur Comptable</label>
          <input
            id="value"
            type="number"
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-neutral-800 border border-border rounded-md p-2 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-neutral-700 hover:text-white">
            Annuler
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            Ajouter
          </button>
        </div>
      </form>
    </Modal>
  );
};
