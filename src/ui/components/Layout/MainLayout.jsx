export const MainLayout = ({ children }) => {
    return (
        <div
            data-portal-container='main-layout'
            id="main-layout"
            className="relative h-screen w-screen overflow-hidden">
            {children}
        </div>
    );
};
