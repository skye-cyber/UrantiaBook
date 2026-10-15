import { useCallback, useRef } from 'react';
import { hideStatus } from './util';
import ErrorBoundary from '../ErrorHandler/ErrorBoundary';

export const LoadingSpinner_primitive = ({ text = "Processing, please wait..." }) => {
    const Spinner = useRef(null)
    const backdrop = useRef(null);
    const SpinnerBody = useRef(null)
    const spinnerText = useRef(null)

    return (
        <>
            <div ref={backdrop} className="fixed inset-0 z-[41] bg-black/50 backdrop-brightness-100 animate-fade-in transition-all duration-100"></div>
            <section ref={Spinner} className='fixed inset-1 flex items-center justify-center z-41'>
                <div ref={SpinnerBody} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center animate-enter transition-all duration-700 opacity-100 w-fit min-w-72 max-w-[400px]">
                    {/* Spinner Animation */}
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin-200"></div>
                    <p ref={spinnerText} className="text-truncate mt-3 text-gray-700">{text}</p>
                </div>
            </section>
        </>
    )
}

// ============================================================
// DualRingGlassLoader
// Reference: Glassmorphic dual-ring — light, refined, neutral
// Drop-in replacement for LoadingSpinner
// ============================================================
// ============================================================
// DualRingGlassLoader
// Reference: Glassmorphic dual-ring — light, refined, neutral
// Drop-in replacement for LoadingSpinner
//
// FIX: rotation is isolated on wrapper elements so the border
// pseudo-spinner never has its transform context clobbered.
// ============================================================
export const DualRingGlassLoader = ({
    text = "Processing, please wait...",
    ringColor = "#3b82f6",
    ringColorDeep = "#2563eb",
    ringTrack = "rgba(59, 130, 246, 0.25)",
    ringTrackDeep = "rgba(59, 130, 246, 0.15)",
    cardBg = "rgba(255, 255, 255, 0.92)",
    cardBorder = "rgba(255, 255, 255, 0.5)",
    accentColor = "rgb(191, 219, 254)", // blue-200
}) => {
    const backdrop = useRef(null);
    const card = useRef(null);
    const spinner = useRef(null);
    const spinnerText = useRef(null);

    return (
        <>
            {/* Backdrop — light overlay with subtle blur */}
            <div
                ref={backdrop}
                className="fixed inset-0 z-[45] bg-black/40 backdrop-brightness-50 animate-fade-in transition-all duration-300"
            />

            <section className="fixed inset-1 flex items-center justify-center z-50">
                <div
                    ref={card}
                    className="relative flex flex-col items-center rounded-2xl p-7 shadow-2xl border animate-enter transition-all duration-700 opacity-100 backdrop-blur-md w-fit min-w-[280px] max-w-[400px]"
                    style={{ background: cardBg, borderColor: cardBorder }}
                >
                    {/* Dual-ring spinner — rotation on wrappers, border on children */}
                    <div ref={spinner} className="relative h-14 w-14 my-1">
                        {/* Outer ring wrapper — rotates */}
                        <div className="absolute inset-0 animate-dual-ring-outer will-change-transform">
                            <div
                                className="h-full w-full rounded-full"
                                style={{
                                    border: `3px solid ${ringTrack}`,
                                    borderTopColor: ringColor,
                                }}
                            />
                        </div>

                        {/* Inner ring wrapper — counter-rotates for depth */}
                        <div className="absolute inset-2 animate-dual-ring-inner will-change-transform">
                            <div
                                className="h-full w-full rounded-full"
                                style={{
                                    border: `2px solid ${ringTrackDeep}`,
                                    borderBottomColor: ringColorDeep,
                                }}
                            />
                        </div>
                    </div>

                    {/* Loader text with soft pulse */}
                    <p
                        ref={spinnerText}
                        className="mt-5 text-base font-medium tracking-tight text-gray-700 animate-soft-pulse text-truncate"
                    >
                        {text}
                    </p>

                    {/* Subtle brand accent line */}
                    <div
                        className="mt-3 h-0.5 w-12 rounded-full"
                        style={{ background: accentColor }}
                    />
                </div>
            </section>
        </>
    );
};

export const GradientOrbLoader = ({
    text = "Deploying preview...",
    accentFrom = "#8b5cf6",
    accentVia = "#ec4899",
    accentTo = "#3b82f6",
}) => {
    const backdrop = useRef(null);
    const card = useRef(null);
    const orb = useRef(null);
    const spinnerText = useRef(null);

    return (
        <>
            {/* Backdrop — deep, saturated blur for premium feel */}
            <div
                ref={backdrop}
                className="fixed inset-0 z-[41] bg-black/70 backdrop-blur-xl backdrop-saturate-150 animate-fade-in transition-all duration-200"
            />

            <section className="fixed inset-1 flex items-center justify-center z-41">
                <div
                    ref={card}
                    className="relative overflow-hidden bg-[#101116]/85 border border-white/[0.08] rounded-[20px] px-12 py-9 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-2xl flex flex-col items-center animate-enter transition-all duration-500 opacity-100 w-fit min-w-72 max-w-[400px]"
                >
                    {/* Ambient gradient glow behind the orb */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-[60%] left-1/2 -translate-x-1/2 h-[240px] w-[240px] rounded-full blur-[20px] opacity-80 animate-orb-glow"
                        style={{
                            background: `radial-gradient(circle, ${accentFrom}73 0%, transparent 65%)`,
                        }}
                    />

                    {/* Conic gradient orb */}
                    <div
                        ref={orb}
                        className="relative h-12 w-12 rounded-full animate-orb-rotate z-10 shadow-[0_0_24px_rgba(139,92,246,0.5),0_0_60px_rgba(236,72,153,0.25)]"
                        style={{
                            background: `conic-gradient(from 0deg, ${accentFrom}, ${accentVia}, #f59e0b, #10b981, ${accentTo}, ${accentFrom})`,
                        }}
                    >
                        {/* Inner cutout to create ring illusion */}
                        <div className="absolute inset-1.5 rounded-full bg-[#101116]" />
                    </div>

                    {/* Gradient text */}
                    <p
                        ref={spinnerText}
                        className="relative z-10 mt-5 text-[13px] font-medium tracking-[0.02em] bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent text-truncate"
                    >
                        {text}
                    </p>
                </div>
            </section>
        </>
    );
};


export const StatusUI = ({ isOpen, onToggle }) => {
    const hideErrorModal = useCallback(() => {
        hideStatus('error')
    })

    const hideSuccessModal = useCallback(() => {
        hideStatus('success')
    })

    return (
        <section>
            {/* General Success Modal */}
            <div id="success-modal-GN" className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 hidden z-[60]">
                <div id="successBoxBody-GN" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm text-center animate-exit transition-all duration-1000">
                    {/* Animated Checkmark */}
                    <div className="flex items-center justify-center">
                        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center animate-scale">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 animate-draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">Success!</h2>
                    <p id="SuccessMsg-GN" className="text-sm text-gray-600 dark:text-gray-300 mt-2">Your action was completed successfully.</p>

                    {/* Close Button */}
                    <button id="CloseSucsessModal-GN" onClick={hideSuccessModal} className="hidden mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                        OK
                    </button>
                </div>
            </div>

            {/* Error Modal */}
            <div id="errorModal-GN" className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
                <div id="errorBox-GN" className="bg-white p-6 rounded-lg shadow-lg min-w-80 max-w-[90vw] md:max-w-[70vw] animate-exit transition-all duration-1000">
                    <h2 className="text-lg font-semibold text-red-600">Error!</h2>
                    <p className="error-message-GN mt-2 text-gray-600" id="errorMessage">Something went wrong.</p>
                    <section className="flex justify-center">
                        <button onClick={hideErrorModal} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                            Close
                        </button>
                    </section>
                </div>
            </div>
        </section>
    );
};


export const LoadingAnimation = ({ }) => {
    const loaderUUID = `loader_${Math.random().toString(30).substring(3, 9)}`;

    return (
        <ErrorBoundary>
            <div id={loaderUUID} className='fixed bottom-[10vh] left-16 z-[71]'>
                <div id="loader-parent">
                    <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="transform scale-75">
                        <circle cx="12" cy="24" r="4" className="fill-green-500">
                            <animate attributeName="cy" values="24;10;24;38;24" keyTimes="0;0.2;0.5;0.8;1" dur="1s" repeatCount="indefinite" />
                            <animate attributeName="fill-opacity" values="1;.2;1" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="24" cy="24" r="4" className="fill-blue-500">
                            <animate attributeName="cy" values="24;10;24;38;24" keyTimes="0;0.2;0.5;0.8;1" dur="1s" repeatCount="indefinite" begin="-0.4s" />
                            <animate attributeName="fill-opacity" values="1;.2;1" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" begin="-0.4s" />
                        </circle>
                        <circle cx="36" cy="24" r="4" className="fill-yellow-500">
                            <animate attributeName="cy" values="24;10;24;38;24" keyTimes="0;0.2;0.5;0.8;1" dur="1s" repeatCount="indefinite" begin="-0.8s" />
                            <animate attributeName="fill-opacity" values="1;.2;1" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite" begin="-0.8s" />
                        </circle>
                    </svg>
                </div>
            </div>
        </ErrorBoundary>
    )
}
