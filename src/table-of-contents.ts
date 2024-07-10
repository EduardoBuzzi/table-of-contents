import { Options } from './types.ts'
import styles from './table-of-contents.css?inline'
import tableOfContents from './table-of-contents.html?raw'

function createTOC(options: Options = {}) {
    options = Object.assign({}, {
        article: document.body,
        headers: 'h1, h2, h3, h4, h5, h6',
        title: 'Content',
        position: 'beforefirstheading',
        index: true
    }, options)

    const template = document.createElement('template')
    template.innerHTML = tableOfContents

    const tocContainer = template.content.firstElementChild as HTMLElement
    const tocList = tocContainer.querySelector('.toc__list') as HTMLElement
    tocContainer.querySelector('.toc__title')!.textContent = options.title as string

    const headings = findHeadings(options.article, options.headers as string)
    const headingStack: {element: HTMLElement, level: number}[] = [];


    headings.forEach((heading) => {
        const level = parseInt(heading.tagName[1], 10);

        if (!heading.id) {
            heading.id = heading.textContent?.trim().toLowerCase().replace(/\s+/g, '-') as string;
        }

        while (headingStack.length && headingStack[headingStack.length - 1].level >= level) {
            headingStack.pop();
        }

        const listItem = document.createElement("li");
        const link = document.createElement("a");
        // link.href = `#${heading.id}`;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
            link.classList.add('toc__link-visited');
            // history.pushState(null, '', `#${heading.id}`);
        });
        link.textContent = `${heading.textContent}`;
        listItem.appendChild(link);
        
        if (headingStack.length) {
            let parentList = headingStack[headingStack.length - 1].element.querySelector("ol");
            if (!parentList) {
                parentList = document.createElement("ol");
                headingStack[headingStack.length - 1].element.appendChild(parentList);
            }
            parentList.appendChild(listItem);
        } else {
            tocList.appendChild(listItem);
        }

        headingStack.push({element: listItem, level: level});
    });
    tocContainer.appendChild(tocList);

    options.index && addIndexes(tocContainer)

    insertTOC()

    addUtilityClasses()

    function findHeadings(article: string | Document | HTMLElement | undefined, headers: string): NodeListOf<Element> {
        let baseElement: Document | Element = document;
        if (article) {
            const articleElement = typeof article === 'string' ? document.querySelector(article) : article;
            if (articleElement) {
                baseElement = articleElement;
            } else {
                throw new Error(`Article not found: ${options.article}`);
            }
        }
        return baseElement.querySelectorAll(headers);
    }

    function insertTOC() {
        const article = typeof options.article === 'string' ? document.querySelector(options.article) : options.article;
        if (!article) {
            return;
        }

        const firstHeading = article.querySelector(options.headers as string);

        switch (options.position) {
            case 'beforefirstheading':
                article.insertBefore(tocContainer, firstHeading);
                break;
            case 'afterfirstheading':
                article.insertBefore(tocContainer, firstHeading?.nextElementSibling as Node | null);
                break;
            case 'afterfirstblock':
                article.insertBefore(tocContainer, article.children[1]);
                break;
            case 'top':
                article.prepend(tocContainer);
                break;
            case 'bottom':
                article.appendChild(tocContainer);
                break;
        }
    }   

    function addIndexes(toc: HTMLElement) {
        const rootOl = toc.querySelector('ol');
        if (rootOl) {
            addIndex(rootOl, '');
        }

        function addIndex(ol: HTMLOListElement, prefix: string) {
            const items = ol.children;
            for (let i = 0; i < items.length; i++) {
                const li = items[i] as HTMLLIElement;
                const index = `${prefix}${i + 1}`;
                const a = li.querySelector('a');
                if (a) {
                    a.textContent = `${index}. ${a.textContent}`;
                }
                const nestedOl = li.querySelector('ol');
                if (nestedOl) {
                addIndex(nestedOl, `${index}.`);
                }
            }
        }
    }

    function addUtilityClasses() {
        if (!document.getElementById('toc-utility-styles')) {
            const style = document.createElement('style')
            style.id = 'toc-utility-styles'
            style.innerHTML = styles
            document.head.appendChild(style)
        }
    }
}

if (typeof (window) !== 'undefined') {
	window.createTOC = createTOC
}