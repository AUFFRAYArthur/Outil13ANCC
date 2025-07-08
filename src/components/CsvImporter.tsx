import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { CsvRow } from '../types';

interface Props {
  onImport: (data: CsvRow[]) => void;
  disabled?: boolean;
}

const REQUIRED_HEADERS = ['COMPTE', 'LIBELLE', 'DEBIT', 'CREDIT', 'ANNEE'];

export const CsvImporter = ({ onImport, disabled }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields;
        const hasRequiredHeaders = REQUIRED_HEADERS.every(h => headers?.includes(h));

        if (!hasRequiredHeaders) {
          setError(`En-têtes manquants ou incorrects. Requis : ${REQUIRED_HEADERS.join(', ')}`);
          return;
        }
        
        onImport(results.data as CsvRow[]);
      },
      error: (err) => {
        setError(`Erreur lors du parsing CSV : ${err.message}`);
      }
    });

    // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 border border-border bg-surface hover:bg-surface/80 text-text-secondary font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UploadCloud size={18} />
        Importer CSV
      </button>
      {error && <p className="text-xs text-error mt-2">{error}</p>}
    </div>
  );
};
