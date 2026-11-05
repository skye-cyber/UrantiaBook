import React from "react"

export interface BookItemStruct {
    part_id: number,
    paper_id: number,
    section_number: number,
};

export interface BookSection {
    section_number: number
    title: string
    paragraphs: BookParagraph[]
}

export interface BookParagraph {
    paragraph_number: number
    text: string
}

export interface BookPart {
    id: number
    title: string
    range?: number[]
    papers: BookPaper[]
}

export interface BookPaper {
    paper_id: number
    title: string
    sections: BookSection[]
}

export interface BookItemInterface {
    part: BookPart,
    paper: BookPaper,
    section: BookSection,
    title: string,
    tag: string,
    struct: BookItemStruct
}

export type CSSVars = React.CSSProperties & {
    [key: `--${string}`]: string | number;
};

export type BookItemPlaceholderProps = {
    /** The overall shape/layout of the placeholder */
    variant?: "default" | "list-item";
    /** Font/line height size */
    size?: "sm" | "md" | "lg";
    /** Theme fallback (defaults to light) */
    theme?: "light" | "dark";

    /** Global base color */
    base?: string;
    /** Global highlight color (the sweeping light) */
    highlight?: string;
    /** Override just the title color */
    titleBase?: string;
    titleHighlight?: string;
    /** Override just the subtitle color */
    subtitleBase?: string;
    subtitleHighlight?: string;
    /** Override just the icon colors */
    iconBase?: string;
    iconHighlight?: string;

    duration?: string;
    className?: string;
    style?: CSSVars;
};
