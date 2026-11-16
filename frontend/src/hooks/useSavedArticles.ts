import { useState, useEffect, useCallback } from "react";

const SAVED_KEY = "quick-news:saved";
const SAVED_EVENT = "quick-news:saved-updated";

function getStoredSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to parse saved articles from localStorage:", e);
    return [];
  }
}

export function useSavedArticles() {
  const [savedIds, setSavedIds] = useState<string[]>(getStoredSavedIds);

  useEffect(() => {
    const handleUpdate = () => {
      setSavedIds(getStoredSavedIds());
    };

    window.addEventListener(SAVED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(SAVED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const saveToStorage = useCallback((ids: string[]) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
      setSavedIds(ids);
      window.dispatchEvent(new Event(SAVED_EVENT));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, []);

  const isSaved = useCallback(
    (id: string | number) => savedIds.includes(String(id)),
    [savedIds]
  );

  const toggleSave = useCallback(
    (id: string | number) => {
      const idStr = String(id);
      const current = getStoredSavedIds();
      const updated = current.includes(idStr)
        ? current.filter((item) => item !== idStr)
        : [idStr, ...current];
      saveToStorage(updated);
    },
    [saveToStorage]
  );

  const removeSaved = useCallback(
    (id: string | number) => {
      const idStr = String(id);
      const current = getStoredSavedIds();
      const updated = current.filter((item) => item !== idStr);
      saveToStorage(updated);
    },
    [saveToStorage]
  );

  const clearSaved = useCallback(() => {
    saveToStorage([]);
  }, [saveToStorage]);

  return {
    savedIds,
    isSaved,
    toggleSave,
    removeSaved,
    clearSaved,
  };
}
