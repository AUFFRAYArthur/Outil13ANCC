import { useState, useMemo, useCallback } from 'react';
import { bilanInitialData } from '../data/bilanInitial';
import { Adjustments, BilanItem, AnccResult, Adjustment } from '../types';

const TAX_RATE = 0.25; // Taux d'impôt sur les sociétés de 25%

export const useAncc = () => {
  const [bilan, setBilan] = useState<BilanItem[]>(bilanInitialData);
  const [adjustments, setAdjustments] = useState<Adjustments>({});
  const [isLocked, setIsLocked] = useState(false);

  const updateBilanItemValue = useCallback((id: string, newValue: number) => {
    if (isLocked) return;
    setBilan(prevBilan => 
      prevBilan.map(item => 
        item.id === id ? { ...item, value: isNaN(newValue) ? 0 : newValue } : item
      )
    );
  }, [isLocked]);

  const getAdjustmentFor = useCallback((id: string): Adjustment => {
    const item = bilan.find(i => i.id === id);
    const defaultApplyTax = item?.applyDeferredTax !== false && !item?.isFictif;
    return adjustments[id] || { revaluedValue: null, justification: '', applyDeferredTax: defaultApplyTax };
  }, [adjustments, bilan]);

  const updateAdjustment = useCallback((id: string, revaluedValue: number | null, justification: string, applyDeferredTax: boolean) => {
    if (isLocked) return;
    setAdjustments(prev => ({
      ...prev,
      [id]: { revaluedValue, justification, applyDeferredTax },
    }));
  }, [isLocked]);

  const loadAdjustments = useCallback((newAdjustments: Adjustments) => {
    setAdjustments(newAdjustments);
  }, []);

  const results: AnccResult = useMemo(() => {
    const totalActif = bilan
      .filter(item => item.category.startsWith('actif') || item.category.startsWith('tresorerie'))
      .reduce((sum, item) => sum + item.value, 0);

    const totalPassif = bilan
      .filter(item => item.category.startsWith('capitaux') || item.category.startsWith('dettes'))
      .reduce((sum, item) => sum + item.value, 0);

    const anc = bilan
      .filter(item => item.category === 'capitaux-propres')
      .reduce((sum, item) => sum + item.value, 0);

    let totalPlusValues = 0;
    let totalMinusValues = 0;
    let taxableNetAdjustments = 0;

    bilan.forEach(item => {
      const adj = getAdjustmentFor(item.id);
      let diff = 0;
      let hasAdjustment = false;

      if (item.isFictif) {
        diff = -item.value;
        hasAdjustment = true;
      } else if (adj.revaluedValue !== null && adj.revaluedValue !== undefined) {
        diff = adj.revaluedValue - item.value;
        hasAdjustment = true;
      }

      if (hasAdjustment) {
        if (item.category === 'dettes') {
          diff = -diff;
        }

        if (diff > 0) {
          totalPlusValues += diff;
        } else {
          totalMinusValues += Math.abs(diff);
        }

        if (adj.applyDeferredTax) {
          taxableNetAdjustments += diff;
        }
      }
    });

    const netAdjustments = totalPlusValues - totalMinusValues;
    const impotDiffere = taxableNetAdjustments > 0 ? taxableNetAdjustments * TAX_RATE : 0;
    const ancc = anc + netAdjustments - impotDiffere;

    return {
      anc,
      totalActif,
      totalPassif,
      totalPlusValues,
      totalMinusValues,
      netAdjustments,
      impotDiffere,
      ancc,
    };
  }, [bilan, adjustments, getAdjustmentFor]);

  const completeness = useMemo(() => {
    const totalItems = bilan.filter(i => !i.isFictif).length;
    if (totalItems === 0) return 100;
    const adjustedItems = Object.keys(adjustments).filter(k => {
        const adj = adjustments[k];
        const item = bilan.find(i => i.id === k);
        return !item?.isFictif && adj.revaluedValue !== null;
    }).length;
    return Math.round((adjustedItems / totalItems) * 100);
  }, [adjustments, bilan]);

  return {
    bilan,
    adjustments,
    updateAdjustment,
    updateBilanItemValue,
    loadAdjustments,
    results,
    isLocked,
    setIsLocked,
    getAdjustmentFor,
    completeness,
    taxRate: TAX_RATE,
  };
};
