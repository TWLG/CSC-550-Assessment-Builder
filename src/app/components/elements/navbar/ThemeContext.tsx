// ThemeContext.js
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from "react";

type ThemeContextType = {
  currentThemeIndex: number;
  setCurrentThemeIndex: React.Dispatch<React.SetStateAction<number>>;
  themes: string[];
};

const defaultContextValue: ThemeContextType = {
  currentThemeIndex: 0,
  setCurrentThemeIndex: () => {}, // This is a no-op, but has the correct type
  themes: ["light-theme", "dark-theme", "retro-theme", "mint-theme"],
};

const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const useTheme = () => useContext(ThemeContext);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const themes = useMemo(
    () => ["light-theme", "dark-theme", "retro-theme", "mint-theme"],
    []
  );

  useEffect(() => {
    const savedThemeIndex = localStorage.getItem("themeIndex");
    if (savedThemeIndex !== null) {
      document.documentElement.classList.add(themes[Number(savedThemeIndex)]);
    } else {
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const preferredThemeIndex = prefersDarkScheme ? 1 : 0;
      setCurrentThemeIndex(preferredThemeIndex);
      document.documentElement.classList.add(themes[preferredThemeIndex]);
    }
  }, [themes]);

  const value: ThemeContextType = {
    currentThemeIndex,
    setCurrentThemeIndex,
    themes,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
