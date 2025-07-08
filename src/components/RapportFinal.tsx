import { BilanItem, AnccResult, Adjustment } from '../types';
import { BarChart3 } from 'lucide-react';

interface Props {
  bilan: BilanItem[];
  results: AnccResult;
  getAdjustmentFor: (id: string) => Adjustment;
  taxRate: number;
}

const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(num);

export const RapportFinal = ({ bilan, results, getAdjustmentFor, taxRate }: Props) => {
  const { anc, totalPlusValues, totalMinusValues, netAdjustments, impotDiffere, ancc } = results;
  const adjustedItems = bilan.filter(item => getAdjustmentFor(item.id).revaluedValue !== null || item.isFictif);

  return (
    <div className="print-container bg-surface border border-border rounded-xl p-8 print-bg-white print-text-black">
      <header className="flex items-center justify-between pb-4 border-b border-border print-border-gray">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg print-bg-white">
            <BarChart3 className="text-primary h-8 w-8 print-text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text print-text-black">Rapport d'Évaluation ANCC</h1>
            <p className="text-text-secondary print-text-black">Généré le {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
      </header>

      <section className="my-8 print-section">
        <h2 className="text-2xl font-semibold mb-4 print-text-black">1. Synthèse du Calcul</h2>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div className="font-semibold print-text-black">Actif Net Comptable (ANC) initial</div>
          <div className="text-right font-mono print-text-black">{formatNumber(anc)}</div>
          
          <div className="text-success print-text-black">Total des Plus-Values</div>
          <div className="text-right font-mono text-success print-text-black">{formatNumber(totalPlusValues)}</div>

          <div className="text-error print-text-black">Total des Moins-Values</div>
          <div className="text-right font-mono text-error print-text-black">{formatNumber(totalMinusValues)}</div>

          <div className="font-semibold border-t border-border pt-2 print-border-gray print-text-black">Ajustement Net</div>
          <div className="text-right font-mono border-t border-border pt-2 print-border-gray print-text-black">{formatNumber(netAdjustments)}</div>

          <div className="text-warning print-text-black">Impôt Différé Passif ({taxRate * 100}%)</div>
          <div className="text-right font-mono text-warning print-text-black">- {formatNumber(impotDiffere)}</div>
        </div>
        <div className="mt-6 p-4 bg-primary/10 rounded-lg flex justify-between items-center print-bg-white print-border-gray border">
          <h3 className="text-xl font-bold text-primary print-text-black">Actif Net Comptable Corrigé (ANCC)</h3>
          <div className="text-2xl font-bold text-primary font-mono print-text-black">{formatNumber(ancc)}</div>
        </div>
      </section>

      <section className="my-8 print-section">
        <h2 className="text-2xl font-semibold mb-4 print-text-black">2. Détail des Retraitements</h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border print-border-gray">
            <tr className="print-text-black">
              <th className="p-2 font-semibold">Élément</th>
              <th className="p-2 font-semibold text-right">V. Comptable</th>
              <th className="p-2 font-semibold text-right">V. Réévaluée</th>
              <th className="p-2 font-semibold text-right">Écart</th>
              <th className="p-2 font-semibold">Justification</th>
            </tr>
          </thead>
          <tbody>
            {adjustedItems.map(item => {
              const adj = getAdjustmentFor(item.id);
              const revalued = item.isFictif ? 0 : adj.revaluedValue ?? item.value;
              const ecart = revalued - item.value;
              return (
                <tr key={item.id} className="border-b border-border/50 print-border-gray print-text-black">
                  <td className="p-2">{item.label}</td>
                  <td className="p-2 text-right font-mono">{formatNumber(item.value)}</td>
                  <td className="p-2 text-right font-mono">{formatNumber(revalued)}</td>
                  <td className={`p-2 text-right font-mono ${ecart > 0 ? 'text-success' : 'text-error'} print-text-black`}>{ecart > 0 ? '+' : ''}{formatNumber(ecart)}</td>
                  <td className="p-2 text-xs italic">{item.isFictif ? 'Actif fictif neutralisé.' : adj.justification || 'Aucune.'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer className="mt-8 pt-4 border-t border-border text-center text-xs text-text-secondary print-border-gray print-text-black">
        <p>Ce rapport est généré automatiquement. Les valeurs sont basées sur les données et retraitements saisis dans l'application.</p>
        <p>Évaluateur ANCC - Propulsé par Bolt & StackBlitz</p>
      </footer>
    </div>
  );
};
