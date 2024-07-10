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
}