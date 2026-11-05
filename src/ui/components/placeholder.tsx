import { BookItemPlaceholderProps, CSSVars } from "../types/global";
import { useTheme } from "./Themes/ThemeContext";

export const Placeholder = ({
    variant = "default",
    size = "md",
    base,
    highlight,
    titleBase,
    titleHighlight,
    subtitleBase,
    subtitleHighlight,
    iconBase,
    iconHighlight,
    duration,
    className = "",
    style,
}: BookItemPlaceholderProps) => {
    const { isDark } = useTheme()
    // Determine layout classes based on variant
    const layoutClasses =
        variant === "list-item"
            ? "flex items-center justify-between gap-4 py-3 px-3"
            : "w-full";

    // Determine height based on size
    const titleSize = size === "sm" ? "h-4" : size === "lg" ? "h-6" : "h-5";
    const subtitleSize = size === "sm" ? "h-3" : size === "lg" ? "h-4" : "h-3.5";

    // Combine inline styles
    const inlineStyles = {
        "--placeholder-base": base,
        "--placeholder-highlight": highlight,
        "--placeholder-title-base": titleBase,
        "--placeholder-title-highlight": titleHighlight,
        "--placeholder-subtitle-base": subtitleBase,
        "--placeholder-subtitle-highlight": subtitleHighlight,
        "--placeholder-icon-base": iconBase,
        "--placeholder-icon-highlight": iconHighlight,
        "--placeholder-duration": duration,
        ...style,
    } as CSSVars;

    return (
        <div
            className={`placeholder-wrapper dark:placeholder-wrapper ${layoutClasses} ${className}`}
            style={inlineStyles}
        >
            {/* Bookmark Icon (Left) */}
            <div className="shrink-0 rounded-full p-2">
                <div className={`placeholder-icon ${titleSize} size-4`} />
            </div>

            {/* Title & Subtitle Section (Center) */}
            <div className="flex-1 flex flex-col gap-2">
                {/* Title */}
                <div className={`placeholder-title rounded-md ${titleSize} w-3/4`} />
                {/* Subtitle */}
                <div className={`placeholder-subtitle rounded-md ${subtitleSize} w-1/4`} />
            </div>

            {/* Action/Favourite Icon (Right) */}
            <div className="shrink-0 rounded-full p-1.5">
                <div className={`placeholder-icon ${titleSize} w-4`} />
            </div>
        </div>
    );
};
