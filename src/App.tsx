import { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { TableauRetraitements } from './components/TableauRetraitements';
import { SyntheseANCC } from './components/SyntheseANCC';
import { RapportFinal } from './components/RapportFinal';
import { useAncc } from './hooks/useAncc';
import { AnimatePresence, motion } from 'framer-motion';
import { Adjustments } from './types';

const TABS = ['Retraitements', 'Synthèse', 'Rapport'];

function App() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const {
    bilan,
    isLocked,
    setIsLocked,
    updateAdjustment,
    updateBilanItemValue,
    getAdjustmentFor,
    results,
    completeness,
    taxRate,
    adjustments,
    loadAdjustments,
  } = useAncc();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataToSave = {
      adjustments,
      bilan,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToSave, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'sauvegarde-ancc.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Le fichier n'est pas un fichier texte.");
        }
        const data = JSON.parse(text);
        if (data && typeof data.adjustments === 'object' && data.adjustments !== null) {
          loadAdjustments(data.adjustments as Adjustments);
        } else {
          alert('Fichier JSON invalide ou mal formaté. Assurez-vous qu\'il contient une clé "adjustments".');
        }
      } catch (error) {
        console.error("Erreur lors de l'importation du JSON:", error);
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <Header onImport={handleImport} onExport={handleExport} isLocked={isLocked} setIsLocked={setIsLocked} />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {activeTab === 'Retraitements' && (
                <TableauRetraitements
                  bilan={bilan}
                  isLocked={isLocked}
                  getAdjustmentFor={getAdjustmentFor}
                  updateAdjustment={updateAdjustment}
                  updateBilanItemValue={updateBilanItemValue}
                />
              )}
              {activeTab === 'Synthèse' && (
                <SyntheseANCC results={results} completeness={completeness} taxRate={taxRate} />
              )}
              {activeTab === 'Rapport' && (
                <RapportFinal bilan={bilan} results={results} getAdjustmentFor={getAdjustmentFor} taxRate={taxRate} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
