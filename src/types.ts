declare global {
    interface Window { 
        createTOC: (options: Options) => void;
    }
}

export type Options = {
    content?: HTMLElement | string
    headers?: string
    title?: string
    position?: 'beforefirstheading' | 'afterfirstheading' | 'afterfirstblock' | 'top' | 'bottom' | string
    index?: boolean
    styles?: {
        titleColor?: string
        titleSize?: string
        titleWeight?: string
        linkColor?: string
        linkSize?: string
        linkWeight?: string
        lineHeight?: string
        listPadding?: string
        listStyleType?: string
        listStylePosition?: string
        listMarkerColor?: string
        toggleColor?: string
        background?: string
        border?: string
        borderRadius?: string
        padding?: string
        margin?: string
        width?: string
    }
}