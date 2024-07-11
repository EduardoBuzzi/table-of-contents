declare global {
    interface Window { 
        createTOC: (options: Options) => void;
    }
}

export type Options = {
    article?: HTMLElement | string
    headers?: string
    title?: string
    position?: 'beforefirstheading' | 'afterfirstheading' | 'afterfirstblock' | 'top' | 'bottom'
    index?: boolean
    styles?: {
        titleColor?: string
        titleSize?: string
        linkColor?: string
        linkSize?: string
        lineHeight?: string
        listPadding?: string
        listStyleType?: string
        listStylePosition?: string
        listMarkerColor?: string
        background?: string
        border?: string
        borderRadius?: string
        padding?: string
        margin?: string
        width?: string
    }
}