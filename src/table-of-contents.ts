import styles from './table-of-contents.css?inline'
import tableOfContents from './table-of-contents.html?raw'

type Options = {
    article?: HTMLElement | string
    headers?: string
    title?: string
    position?: 'beforefirstheading' | 'afterfirstheading' | 'afterfirstblock' | 'top' | 'bottom'
}

function createTOC(options: Options = {}) {
    options = Object.assign({}, {
        article: document.body,
        headers: 'h1, h2, h3, h4, h5, h6',
        title: 'Conteúdo',
        position: 'beforefirstheading'
    }, options)

    const template = document.createElement('template')
    template.innerHTML = tableOfContents

    const tocContainer = template.content.firstElementChild as HTMLElement
    const tocList = tocContainer.querySelector('.toc__list') as HTMLElement
    tocContainer.querySelector('.toc__title')!.textContent = options.title as string

    const headings = findHeadings(options.article, options.headers as string)

    let levelMap: { [key: number]: number } = {};  // Map to keep track of heading levels
    let currentList = tocList;

    headings.forEach(heading => {
        const level = parseInt(heading.tagName[1], 10);

        if (!heading.id) {
            heading.id = heading.textContent?.trim().toLowerCase().replace(/\s+/g, '-') as string;
        }

        // Update levelMap
        if (!levelMap[level]) {
            levelMap[level] = 0;
        }
        levelMap[level]++;

        // Reset lower levels in the map
        Object.keys(levelMap).forEach(key => {
            if (parseInt(key) > level) {
                levelMap[parseInt(key)] = 0;
            }
        });

        const numbering = Object.keys(levelMap)
            .filter(key => parseInt(key) <= level)
            .map(key => levelMap[parseInt(key)])
            .join('.');

        const listItem = document.createElement("li");
        if(level > 2) listItem.style.marginLeft = `${(level - 1) * 10}px`;

        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = `${numbering}. ${heading.textContent}`;
        link.addEventListener('click', function (event) {
            event.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, '', `#${heading.id}`);
        });
        listItem.appendChild(link);

        // Adjust current list based on heading level
        if (level > currentList.dataset.level) {
            const nestedList = document.createElement("ol");
            nestedList.dataset.level = level.toString();
            currentList.lastElementChild?.appendChild(nestedList);
            currentList = nestedList;
        } else if (level < currentList.dataset.level) {
            while (level < parseInt(currentList.dataset.level)) {
                currentList = currentList.parentElement?.closest("ol") || tocList;
            }
        }

        currentList.appendChild(listItem);
    });

    // Insert the TOC before the first heading
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

    function addUtilityClasses() {
        if (!document.getElementById('toc-utility-styles')) {
            const style = document.createElement('style')
            style.id = 'toc-utility-styles'
            style.innerHTML = styles
            document.head.appendChild(style)
        }
    }

    
}

createTOC({
    article: 'article'
});

