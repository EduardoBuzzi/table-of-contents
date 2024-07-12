import { Options } from './types.ts';
import styles from './table-of-contents.css?inline';
import tableOfContents from './table-of-contents.html?raw';

export class TableOfContents {
    private options: Options;
    private container: HTMLElement;
    private list: HTMLElement;
    private toggleButton: HTMLElement;
    private headings: NodeListOf<Element>;

    constructor(options: Options = {}) {
        this.options = Object.assign({}, {
            article: document.body,
            headers: 'h1, h2, h3, h4, h5, h6',
            title: 'Content',
            position: 'beforefirstheading',
            index: true
        }, options);

        const { container, list, toggleButton, headings } = this.getElements();
        this.container = container;
        this.list = list;
        this.toggleButton = toggleButton;
        this.headings = headings;

        this.init();
    }

    private init() {
        this.setup();
        this.populateTOC(this.headings);
        this.insertTOC(this.headings);
        this.options.index && this.addIndexes();
        this.options.styles && this.addStyles(this.container, this.options.styles);
        this.addUtilityClasses();
    }

    private getElements(){
        const template = document.createElement('template');
        template.innerHTML = tableOfContents;
        return {
            container: template.content.firstElementChild as HTMLElement,
            list: template.content.querySelector('.toc__list') as HTMLElement,
            toggleButton: template.content.querySelector('.toc__toggle') as HTMLElement,
            headings: this.findHeadings()
        }
    }
    
    private setup() {
        // setup the title
        const tocTitle = this.container.querySelector('.toc__title') as HTMLElement;
        tocTitle.textContent = this.options.title as string;
        tocTitle.style.setProperty('color', 'var(--toc__title-color, revert-layer)');

        // setup the toggle button
        this.toggleButton.addEventListener('click', this.toggleTOC.bind(this));
    }

    private toggleTOC(event: Event) {
        event.preventDefault();
        this.list.classList.toggle('toc__list-collapsed');
        this.toggleButton.classList.toggle('toc__toggle-collapsed');
        this.toggleButton.setAttribute('aria-expanded', this.toggleButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    }

    private findHeadings(): NodeListOf<Element> {
        const baseElement = typeof this.options.article === 'string' ? document.querySelector(this.options.article) : this.options.article;
        if (!baseElement) {
            throw new Error(`Article not found: ${this.options.article}`);
        }
        return baseElement.querySelectorAll(this.options.headers as string);
    }

    private populateTOC(headings: NodeListOf<Element>) {
        const headingStack: { element: HTMLElement, level: number }[] = [];

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName[1], 10);

            if (!heading.id) {
                heading.id = this.generateHeadingId(heading);
            }

            while (headingStack.length && headingStack[headingStack.length - 1].level >= level) {
                headingStack.pop();
            }

            const listItem = document.createElement("li");
            const link = this.createLink(heading);
            listItem.appendChild(link);

            if (headingStack.length) {
                let parentList = headingStack[headingStack.length - 1].element.querySelector("ol");
                if (!parentList) {
                    parentList = document.createElement("ol");
                    headingStack[headingStack.length - 1].element.appendChild(parentList);
                }
                parentList.appendChild(listItem);
            } else {
                this.list.appendChild(listItem);
            }

            headingStack.push({ element: listItem, level: level });
        });

        this.container.appendChild(this.list);
    }

    private generateHeadingId(heading: Element): string {
        let headingId = heading.textContent?.trim().toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-') as string;

        if (document.getElementById(headingId)) {
            let i = 2;
            while (document.getElementById(`${headingId}-${i}`)) i++;
            headingId = `${headingId}-${i}`;
        }
        return headingId;
    }

    private createLink(heading: Element): HTMLAnchorElement {
        const link = document.createElement("a");
        link.style.setProperty('color', 'var(--toc__link-color, revert-layer)');
        link.style.setProperty('font-size', 'var(--toc__link-size, 90%)');
        link.href = `#${heading.id}`;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
            link.classList.add('toc__link-visited');
            history.pushState(null, '', `#${heading.id}`);
        });
        link.textContent = `${heading.textContent?.trim().replace(/\s+/g, ' ')}`;
        return link;
    }

    private insertTOC(headings: NodeListOf<Element>) {
        const article = typeof this.options.article === 'string' ? document.querySelector(this.options.article) : this.options.article;
        if (!article) {
            return;
        }

        const firstHeading = headings[0] as HTMLElement | null;

        switch (this.options.position) {
            case 'beforefirstheading':
                article.insertBefore(this.container, firstHeading);
                break;
            case 'afterfirstheading':
                article.insertBefore(this.container, firstHeading?.nextElementSibling as Node | null);
                break;
            case 'afterfirstblock':
                article.insertBefore(this.container, article.children[1]);
                break;
            case 'top':
                article.prepend(this.container);
                break;
            case 'bottom':
                article.appendChild(this.container);
                break;
        }
    }

    private addIndexes() {
        const rootOl = this.container.querySelector('ol');
        if (rootOl) {
            this.addIndex(rootOl, '');
        }
    }

    private addIndex(ol: HTMLOListElement, prefix: string) {
        const items = ol.children;
        for (let i = 0; i < items.length; i++) {
            const li = items[i] as HTMLLIElement;
            const index = `${prefix}${i + 1}`;
            const a = li.querySelector('a');
            if (a) {
                a.innerHTML = `<span class="toc__list-index">${index}.</span> ${a.textContent}`;
            }
            const nestedOl = li.querySelector('ol');
            if (nestedOl) {
                this.addIndex(nestedOl, `${index}.`);
            }
        }
    }

    private addStyles(element: HTMLElement, styles: { [key: string]: string }) {
        Object.keys(styles).forEach(key => {
            const cssProperty = `--toc__${this.camelToSnakeCase(key)}`;
            element.style.setProperty(cssProperty, styles[key]);
        });
    }

    private camelToSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    }

    private addUtilityClasses() {
        if (!document.getElementById('toc-utility-styles')) {
            const style = document.createElement('style');
            style.id = 'toc-utility-styles';
            style.innerHTML = styles;
            document.head.appendChild(style);
        }
    }
}
