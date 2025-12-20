// hooks/useSelection.ts
import { useState, useCallback } from 'react';

export const useSelection = <T extends { id: number; selected?: boolean }>(
  initialItems: T[]
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Включить/выключить режим выбора
  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode(prev => {
      if (!prev) {
        // При включении режима снимаем все выделения
        setItems(prevItems => prevItems.map(item => ({ ...item, selected: false })));
      }
      return !prev;
    });
  }, []);

  // Выделить/снять выделение с одной карточки
  const toggleSelectItem = useCallback((id: number) => {
    if (!isSelectionMode) return;

    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  }, [isSelectionMode]);

  // Выделить все карточки
  const selectAll = useCallback(() => {
    setItems(prev => prev.map(item => ({ ...item, selected: true })));
  }, []);

  // Снять все выделения
  const deselectAll = useCallback(() => {
    setItems(prev => prev.map(item => ({ ...item, selected: false })));
  }, []);

  // Получить выбранные элементы
  const getSelectedItems = useCallback(() => {
    return items.filter(item => item.selected);
  }, [items]);

  // Получить ID выбранных элементов
  const getSelectedIds = useCallback(() => {
    return items.filter(item => item.selected).map(item => item.id);
  }, [items]);

  // Проверить, все ли выбрано
  const isAllSelected = useCallback(() => {
    return items.length > 0 && items.every(item => item.selected);
  }, [items]);

  // Проверить, есть ли выбранные элементы
  const hasSelected = useCallback(() => {
    return items.some(item => item.selected);
  }, [items]);

  // Массовое обновление выбранных элементов
  const bulkUpdate = useCallback((updates: Partial<T>) => {
    setItems(prev => prev.map(item =>
      item.selected ? { ...item, ...updates } : item
    ));
  }, []);

  // Выход из режима выбора
  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setItems(prev => prev.map(item => ({ ...item, selected: false })));
  }, []);

  return {
    items,
    setItems,
    isSelectionMode,
    toggleSelectionMode,
    toggleSelectItem,
    selectAll,
    deselectAll,
    getSelectedItems,
    getSelectedIds,
    isAllSelected: isAllSelected(),
    hasSelected: hasSelected(),
    bulkUpdate,
    exitSelectionMode
  };
};