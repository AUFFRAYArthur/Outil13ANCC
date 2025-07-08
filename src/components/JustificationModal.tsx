import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { BilanItem, Adjustment } from '../types';

interface JustificationModalProps {
  item: BilanItem | null;
  adjustment: Adjustment | null;
  onClose: () => void;
  onSave: (justification: string) => void;
}

export const JustificationModal = ({ item, adjustment, onClose, onSave }: JustificationModalProps) => {
  const [justification, setJustification] = useState('');

  useEffect(() => {
    if (adjustment) {
      setJustification(adjustment.justification);
    }
  }, [adjustment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(justification);
    onClose();
  };

  if (!item) return null;

  return (
    <Modal isOpen={!!item} onClose={onClose} title={`Justification pour : ${item.label}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="justification" className="block text-sm font-medium text-text-secondary mb-1">
            Notes et justificatifs du retraitement
          </label>
          <textarea
            id="justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={5}
            className="w-full bg-neutral-800 border border-border rounded-md p-2 text-white focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Saisissez ici la justification de l'écart de valeur..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-neutral-700 hover:text-white">
            Annuler
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90">
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
};
