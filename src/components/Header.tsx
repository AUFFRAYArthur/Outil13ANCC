import { Download, Upload, Lock, Unlock } from 'lucide-react';

interface HeaderProps {
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  onImport: () => void;
  onExport: () => void;
}

export const Header = ({ isLocked, setIsLocked, onImport, onExport }: HeaderProps) => {
  return (
    <header className="bg-surface border-b border-border no-print">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-white">
              Évaluation d'Entreprise <span className="text-primary">ANCC</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onImport}
              disabled={isLocked}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-neutral-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              Importer
            </button>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Download size={16} />
              Exporter
            </button>
            <button
              onClick={() => setIsLocked(!isLocked)}
              className="flex items-center justify-center w-10 h-10 text-text-secondary bg-surface border border-border rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
              title={isLocked ? 'Déverrouiller les champs' : 'Verrouiller les champs'}
            >
              {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
