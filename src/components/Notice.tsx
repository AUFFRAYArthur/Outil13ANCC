import { Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Notice = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 no-print">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Lightbulb className={`transition-colors ${isOpen ? 'text-yellow-400' : 'text-text-secondary'}`} />
        <h3 className="font-semibold text-white">Notice d'utilisation et méthodologie</h3>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 pl-8 text-text-secondary space-y-3 text-sm">
              <p>
                <strong>Objectif de l'outil :</strong> Cet outil vous guide dans le calcul de l'Actif Net Comptable Corrigé (ANCC), une méthode d'évaluation patrimoniale qui vise à déterminer la valeur réelle d'une entreprise.
              </p>
              <p>
                <strong>Principe de l'ANCC :</strong> La méthode consiste à partir du bilan comptable et à corriger la valeur des actifs et des passifs pour refléter leur valeur de marché (ou valeur vénale), plutôt que leur valeur historique.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Actifs :</strong> Les plus-values (valeur réévaluée > valeur comptable) et moins-values sont calculées. Les actifs fictifs (ex: frais d'établissement) sont neutralisés.</li>
                <li><strong>Passifs :</strong> Une augmentation de la valeur d'une dette génère une moins-value, et une diminution une plus-value.</li>
                <li><strong>Impôt Différé :</strong> Un impôt latent est calculé sur les plus-values nettes imposables pour ne pas surévaluer le patrimoine.</li>
              </ul>
               <p>
                <strong>Utilisation :</strong> Renseignez la "Valeur Réévaluée" pour chaque poste. L'outil calcule automatiquement les écarts, l'impôt différé et l'ANCC final. Utilisez l'onglet "Rapport" pour une synthèse imprimable.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
