import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const STORAGE_KEY = "pathfinder_ai_data";

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const initialState = {
  profile: null,
  profileAnalysis: null,
  quizzes: {},
  quizResults: {},
  verifiedSkills: [],
  careers: null,
  chosenCareer: null,
  roadmap: null,
  weekProgress: {},
  currentStep: "landing", // landing, profile, quiz, careers, simulator, roadmap, dashboard
  darkMode: true,
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = loadFromStorage();
    return saved ? { ...initialState, ...saved, darkMode: saved.darkMode ?? true } : initialState;
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  useEffect(() => {
    if (state.darkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [state.darkMode]);

  const update = (partial) => setState((prev) => ({ ...prev, ...partial }));

  const resetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState);
  };

  return (
    <AppContext.Provider value={{ ...state, update, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
