import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { appState } from '../../State/appState';
import { globalEventBus } from '../../../Globals/eventBus';

type ThemeContextType = {
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (theme: string) => void;
    theme: 'dark' | 'light';
    mounted: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    // 1. Initialization (Runs once when the app loads)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        appState.appearance.theme = savedTheme as string;

        const initialIsDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

        setIsDark(initialIsDark);
        document.documentElement.classList.toggle('dark', initialIsDark);
        setMounted(true);
    }, []);

    // 2. Toggle Theme
    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle('dark', newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        appState.appearance.theme = newTheme ? 'dark' : 'light';

        try {
            globalEventBus.emit('toolbar:theme:update', newTheme ? 'dark' : 'light');
        } catch (err) {}
    };

    // 3. Set Specific Theme
    const setTheme = (theme: string) => {
        let finalTheme = theme;

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            finalTheme = systemPrefersDark ? "dark" : "light";
        }

        const newIsDark = finalTheme === 'dark';
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
        localStorage.setItem('theme', finalTheme);
        appState.appearance.theme = finalTheme;

        try {
            globalEventBus.emit('toolbar:theme:update', finalTheme);
        } catch (err) {}
    };

    return (
        <ThemeContext.Provider value={{
            isDark,
            toggleTheme,
            setTheme,
            theme: isDark ? 'dark' : 'light',
            mounted
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Export the hook from here
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
