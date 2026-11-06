import { useEffect, useState } from 'react';
import { MainLayout } from './components/Layout/MainLayout';
import { Header } from './components/Header/Header.tsx';
import { BookContentPanel } from './components/Panels/BookContentPanel.tsx';
import { QuickReadPanel } from './components/Panels/QuickReadPanel';
import { ReaderUI } from './components/Reader/ui';
import ErrorBoundary from './components/ErrorHandler/ErrorBoundary';
import { StatusUI } from './components/StatusUI/StatusUI.jsx';
import { StaticPortalContainer } from './StaticPortalContainer';
import { StreamingPortalContainer } from './StreamingPortalContainer';
import '../common/PortalBridge';
import './PortalTargetRegister';
import '../common/syscore/StatesManager';
import '../common/Status/Manager';
import { NotesPage } from './Pages/Notes';
import '../styles/index.css';
import '../common/shortcuts/keyshortcuts';
import { SettingsPage } from './Pages/SettingsPage.jsx';
import { BookItemSelectorUI } from './components/SelectorUI/ItemSelector.jsx';
import { CopyFeedback } from './components/StatusUI/ToastsUI.jsx';
import { NotesComposer } from './components/ContextMenu/Modals/Notes.jsx';
import { SearchResultPage } from './Pages/Search.jsx';
import { BookItemInterface } from './types/global.tsx';
import { globalEventBus } from '../Globals/eventBus.ts';
import { ThemeProvider } from './components/Themes/ThemeContext.tsx';
import { ContentLoader_ins } from './components/Panels/content_loader.tsx';
import { waitForElement } from '../common/syscore/dom_utils.js';

const App = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookItems, setBookItems] = useState<BookItemInterface[]>([])
    const [setupOk, setSetupOk] = useState<boolean>(false)

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        if (setupOk) return;
        let isMounted = true;

        ContentLoader_ins.setForeword(true);

        // Just call it directly, because main.tsx already waited for DOM
        waitForElement('[data-tag="0-0-0"]', (el: HTMLElement) => {
            el.click();
        }, { timeout: 3000 } as any);

        setSetupOk(true);

        return () => { isMounted = false; };
    }, [setupOk]);

    // Global Event Bus Listener (Runs once on mount)
    useEffect(() => {
        const setter = globalEventBus.on('ui:selector:setitems', (items) => {
            setBookItems(items);
        });

        return () => {
            setter.unsubscribe();
        };
    }, [bookItems]);

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <MainLayout>
                    <Header />
                    <div className='relative h-screen w-screen flex'>
                        <BookContentPanel />
                        <ReaderUI />
                        <CopyFeedback />
                        <NotesComposer />
                        <SearchResultPage />
                        <QuickReadPanel />
                    </div>
                    {/* status display modals */}
                    <div data-portal-container='messageContainer'
                        id='message-container'
                        className='fixed top-5 right-0 z-[50] w-72 transform transition-all duration-700 ease-in-out safe-area-inset'>
                    </div>
                    {/* confirm dialog */}
                    <div data-portal-container='confirm-dialog-container' id='confirm-dialog-container'></div>

                    <BookItemSelectorUI bookItems={bookItems} />
                    <SettingsPage />
                    <StatusUI />
                    <NotesPage />
                </MainLayout>
                {/* Portal containers for vanilla JS components */}
                <StaticPortalContainer />
                <StreamingPortalContainer />
            </ThemeProvider>
        </ErrorBoundary >
    );
};

export default App;
