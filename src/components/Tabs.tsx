import { motion } from 'framer-motion';
import { cn } from '../utils';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
  return (
    <div className="flex space-x-1 bg-surface p-1 rounded-xl border border-border no-print">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={cn(
            'relative w-full rounded-lg px-4 py-3 text-base font-semibold leading-5 transition-colors duration-300',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/75',
            activeTab === tab
              ? 'text-white'
              : 'text-text-secondary hover:bg-white/[0.1] hover:text-white'
          )}
        >
          <span className="relative z-10">{tab}</span>
          {activeTab === tab && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute inset-0 z-0 bg-primary"
              style={{ borderRadius: '0.65rem' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
