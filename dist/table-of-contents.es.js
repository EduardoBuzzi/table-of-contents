var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
/*! table-of-contents - v1.0.0 */
const styles = ".toc__container{display:inline-block;position:relative;background:var(--toc__background, rgb(0 0 0 / 3%));padding:var(--toc__padding, 14px 18px 18px);border-radius:var(--toc__border-radius, 5px);border:var(--toc__border, unset);margin:var(--toc__margin, 32px 0);width:var(--toc__width, auto)}.toc__container .toc__header{display:flex;justify-content:space-between;align-items:center}.toc__container .toc__header .toc__toggle{cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border:none;background:none;transition:all .3s ease;margin:0 0 0 10px}.toc__container .toc__header .toc__toggle.toc__toggle-collapsed{transform:rotate(180deg)}.toc__container .toc__title{font-size:var(--toc__title-size, 100%)!important;margin:0!important;padding:0!important;line-height:unset}.toc__container ol.toc__list{margin:6px 0 0!important;padding:0!important;transition:var(--toc__transition, all .3s ease)}.toc__container ol{line-height:var(--toc__line-height, revert-layer)!important;padding-left:var(--toc__list-padding, 14px)!important;margin:0!important;list-style-type:var(--toc__list-style-type, none)!important;list-style-position:var(--toc__list-style-position, inside)!important}.toc__container ol ::marker{color:var(--toc__list-marker-color, var(--toc__link-color, currentColor))}.toc__container a.toc__link-visited{opacity:.7}.toc__container a{cursor:pointer;box-shadow:none!important;border:none!important;text-decoration:none!important}.toc__container .toc__list a:hover{text-decoration:none!important;border-bottom:1px dotted!important}.toc__container .toc__list-index{color:var(--toc__index-color, currentColor)}.toc__container ol.toc__list.toc__list-collapsed{display:none!important}.toc__container ol.toc__list{animation:toc__appear .5s ease-in-out 1;transition-property:display,max-height;transition-duration:.5s;transition-behavior:allow-discrete;max-height:1000px}.toc__container ol.toc__list.toc__list-collapsed{animation:toc__disappear .5s ease-in-out 1;max-height:0}@keyframes toc__appear{0%{opacity:0;max-height:0}to{opacity:1;max-height:1000px}}@keyframes toc__disappear{0%{opacity:1;max-height:1000px;display:block!important}to{opacity:0;max-height:0;display:none!important}}";
const tableOfContents = '<div class="toc__container">\r\n    <div class="toc__header">\r\n        <span class="toc__title">Table of contents</span>\r\n        <a href="#" class="toc__toggle" aria-expanded="true" aria-controls="toc__list" role="button" style="color: var(--toc__toggle-color, var(--toc__link-color, revert-layer))">\r\n            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>\r\n        </a>\r\n    </div>\r\n    <ol class="toc__list"></ol>\r\n</div>';
class TableOfContents {
  constructor(options = {}) {
    __publicField(this, "options");
    __publicField(this, "container");
    __publicField(this, "list");
    __publicField(this, "toggleButton");
    __publicField(this, "headings");
    this.options = Object.assign({}, {
      content: document.body,
      headers: "h1, h2, h3, h4, h5, h6",
      title: "Contents",
      position: "beforefirstheading",
      index: true
    }, options);
    const elements = this.getElements();
    this.headings = elements.headings;
    this.container = elements.container;
    this.list = elements.list;
    this.toggleButton = elements.toggleButton;
    this.init();
  }
  init() {
    this.setup();
    this.populateTOC(this.headings);
    this.insertTOC(this.headings);
    this.options.index && this.addIndexes();
    this.options.styles && this.addStyles(this.container, this.options.styles);
    this.addUtilityClasses();
    this.scrollToCurrentHeading();
  }
  getElements() {
    const template = document.createElement("template");
    template.innerHTML = tableOfContents;
    let content;
    if (typeof this.options.content === "string") {
      content = document.querySelector(this.options.content);
      if (!content) {
        throw new Error(`Content element not found: ${this.options.content}`);
      }
    } else {
      content = this.options.content;
    }
    let headings = Array.from(content.querySelectorAll(this.options.headers)).filter((heading) => heading.textContent && heading.textContent.trim() !== "");
    if (!headings.length) {
      throw new Error("Heading elements not found");
    }
    return {
      content,
      container: template.content.firstElementChild,
      list: template.content.querySelector(".toc__list"),
      toggleButton: template.content.querySelector(".toc__toggle"),
      headings
    };
  }
  setup() {
    const tocTitle = this.container.querySelector(".toc__title");
    tocTitle.textContent = this.options.title;
    tocTitle.style.setProperty("color", "var(--toc__title-color, revert-layer)");
    tocTitle.style.setProperty("font-weight", "var(--toc__title-weight, revert-layer)");
    this.toggleButton.addEventListener("click", this.toggleTOC.bind(this));
  }
  toggleTOC(event) {
    event.preventDefault();
    this.list.classList.toggle("toc__list-collapsed");
    this.toggleButton.classList.toggle("toc__toggle-collapsed");
    this.toggleButton.setAttribute("aria-expanded", this.toggleButton.getAttribute("aria-expanded") === "true" ? "false" : "true");
  }
  populateTOC(headings) {
    const headingStack = [];
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
      headingStack.push({ element: listItem, level });
    });
    this.container.appendChild(this.list);
  }
  generateHeadingId(heading) {
    var _a;
    let headingId = (_a = heading.textContent) == null ? void 0 : _a.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    if (document.getElementById(headingId)) {
      let i = 2;
      while (document.getElementById(`${headingId}-${i}`)) i++;
      headingId = `${headingId}-${i}`;
    }
    return headingId;
  }
  createLink(heading) {
    var _a;
    const link = document.createElement("a");
    link.style.setProperty("color", "var(--toc__link-color, revert-layer)");
    link.style.setProperty("font-size", "var(--toc__link-size, 90%)");
    link.style.setProperty("font-weight", "var(--toc__link-weight, revert-layer)");
    link.href = `#${heading.id}`;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      heading.scrollIntoView({ behavior: "smooth" });
      link.classList.add("toc__link-visited");
      history.pushState(null, "", `#${heading.id}`);
    });
    link.textContent = `${(_a = heading.textContent) == null ? void 0 : _a.trim().replace(/\s+/g, " ")}`;
    return link;
  }
  insertTOC(headings) {
    const firstHeading = headings[0];
    const parent = firstHeading == null ? void 0 : firstHeading.parentElement;
    if (!parent) {
      throw new Error("No parent element found for headings");
    }
    switch (this.options.position) {
      case "beforefirstheading":
        parent.insertBefore(this.container, firstHeading);
        break;
      case "afterfirstheading":
        parent.insertBefore(this.container, firstHeading == null ? void 0 : firstHeading.nextElementSibling);
        break;
      case "afterfirstblock":
        parent.insertBefore(this.container, parent.children[1]);
        break;
      case "top":
        parent.prepend(this.container);
        break;
      case "bottom":
        parent.appendChild(this.container);
        break;
      default:
        const customPosition = document.querySelector(this.options.position || "");
        if (!customPosition) {
          throw new Error(`Invalid selector for position: ${this.options.position}`);
        }
        customPosition.appendChild(this.container);
    }
  }
  addIndexes() {
    const rootOl = this.container.querySelector("ol");
    if (rootOl) {
      this.addIndex(rootOl, "");
    }
  }
  addIndex(ol, prefix) {
    const items = ol.children;
    for (let i = 0; i < items.length; i++) {
      const li = items[i];
      const index = `${prefix}${i + 1}`;
      const a = li.querySelector("a");
      if (a) {
        a.innerHTML = `<span class="toc__list-index">${index}.</span> ${a.textContent}`;
      }
      const nestedOl = li.querySelector("ol");
      if (nestedOl) {
        this.addIndex(nestedOl, `${index}.`);
      }
    }
  }
  addStyles(element, styles2) {
    Object.keys(styles2).forEach((key) => {
      const cssProperty = `--toc__${this.camelToSnakeCase(key)}`;
      element.style.setProperty(cssProperty, styles2[key]);
    });
  }
  scrollToCurrentHeading() {
    if (window.location.hash) {
      const currentHeading = document.getElementById(window.location.hash.slice(1));
      if (currentHeading && currentHeading.tagName.match(/^H[1-6]$/)) {
        window.addEventListener("load", () => {
          setTimeout(() => {
            currentHeading.scrollIntoView({ behavior: "instant" });
            console.log("scrolling to current heading");
          }, 1);
        });
      }
    }
  }
  camelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  }
  addUtilityClasses() {
    if (!document.getElementById("toc-utility-styles")) {
      const style = document.createElement("style");
      style.id = "toc-utility-styles";
      style.innerHTML = styles;
      document.head.appendChild(style);
    }
  }
}
function createTOC(options = {}) {
  new TableOfContents(options);
}
if (typeof window !== "undefined") {
  window.createTOC = createTOC;
}
