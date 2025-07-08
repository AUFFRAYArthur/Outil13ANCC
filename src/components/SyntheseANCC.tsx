import { AnccResult } from '../types';
import { TrendingUp, TrendingDown, Scale, Landmark, Percent, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  results: AnccResult;
  completeness: number;
  taxRate: number;
}

const formatNumber = (num: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(num);

const StatCard = ({ icon, label, value, color, note }: { icon: React.ReactNode, label: string, value: string, color: string, note?: string }) => (
  <motion.div 
    className={`bg-surface border border-border rounded-xl p-6 flex flex-col justify-between`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div>
      <div className={`mb-4 inline-block p-2 rounded-lg bg-${color}/10`}>
        {icon}
      </div>
      <p className="text-text-secondary mb-1">{label}</p>
      <p className="text-3xl font-bold text-text">{value}</p>
    </div>
    {note && <p className="text-xs text-text-secondary mt-4">{note}</p>}
  </motion.div>
);

export const SyntheseANCC = ({ results, completeness, taxRate }: Props) => {
  const { anc, totalPlusValues, totalMinusValues, netAdjustments, impotDiffere, ancc } = results;

  return (
    <div className="space-y-8">
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Synthèse de l'Évaluation</h2>
        <p className="text-text-secondary mb-6">Vue d'ensemble des calculs et du résultat final de l'Actif Net Comptable Corrigé.</p>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Complétude des retraitements</span>
            <span className={`font-bold ${completeness === 100 ? 'text-success' : 'text-primary'}`}>{completeness}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2.5">
            <motion.div 
              className={`h-2.5 rounded-full ${completeness === 100 ? 'bg-success' : 'bg-primary'}`} 
              style={{ width: `${completeness}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Scale size={24} className="text-primary" />} label="Actif Net Comptable (ANC)" value={formatNumber(anc)} color="primary" />
          <StatCard icon={<TrendingUp size={24} className="text-success" />} label="Total Plus-Values" value={formatNumber(totalPlusValues)} color="success" />
          <StatCard icon={<TrendingDown size={24} className="text-error" />} label="Total Moins-Values" value={formatNumber(totalMinusValues)} color="error" />
          <StatCard icon={<Landmark size={24} className="text-warning" />} label="Impôt Différé Passif" value={formatNumber(impotDiffere)} color="warning" note={`Basé sur un taux de ${taxRate * 100}%`} />
        </div>
      </div>

      <motion.div 
        className="bg-gradient-to-br from-primary/80 to-accent/80 p-1 rounded-xl shadow-glow-primary"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="bg-surface rounded-lg p-8 text-center">
          <p className="text-lg text-text-secondary">Valeur de l'entreprise (ANCC)</p>
          <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent my-2">
            {formatNumber(ancc)}
          </p>
          <p className="text-text-secondary">
            ANC {formatNumber(anc)} <span className={netAdjustments >= 0 ? 'text-success' : 'text-error'}>{netAdjustments >= 0 ? '+' : ''} {formatNumber(netAdjustments)}</span> (Ajustements) - {formatNumber(impotDiffere)} (Impôt)
          </p>
        </div>
      </motion.div>
    </div>
  );
};
