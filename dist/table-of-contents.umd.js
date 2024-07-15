!function(t){"function"==typeof define&&define.amd?define(t):t()}((function(){"use strict";var t=Object.defineProperty,e=(e,o,n)=>((e,o,n)=>o in e?t(e,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[o]=n)(e,"symbol"!=typeof o?o+"":o,n)
/*! table-of-contents - v0.1.0 */;class o{constructor(t={}){e(this,"options"),e(this,"container"),e(this,"list"),e(this,"toggleButton"),e(this,"headings"),this.options=Object.assign({},{content:document.body,headers:"h1, h2, h3, h4, h5, h6",title:"Contents",position:"beforefirstheading",index:!0},t);const o=this.getElements();this.headings=o.headings,this.container=o.container,this.list=o.list,this.toggleButton=o.toggleButton,this.init()}init(){this.setup(),this.populateTOC(this.headings),this.insertTOC(this.headings),this.options.index&&this.addIndexes(),this.options.styles&&this.addStyles(this.container,this.options.styles),this.addUtilityClasses(),this.scrollToCurrentHeading()}getElements(){const t=document.createElement("template");let e;if(t.innerHTML='<div id="toc__container">\r\n    <div class="toc__header">\r\n        <h2 class="toc__title">Table of contents</h2>\r\n        <a href="#" class="toc__toggle" aria-expanded="true" aria-controls="toc__list" role="button" style="color: var(--toc__toggle-color, var(--toc__link-color, revert-layer))">\r\n            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m12 10.8l-3.9 3.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.6-4.6q.3-.3.7-.3t.7.3l4.6 4.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/></svg>\r\n        </a>\r\n    </div>\r\n    <ol class="toc__list"></ol>\r\n</div>',"string"==typeof this.options.content){if(e=document.querySelector(this.options.content),!e)throw new Error(`Content element not found: ${this.options.content}`)}else e=this.options.content;let o=e.querySelectorAll(this.options.headers);if(!o.length)throw new Error("Heading elements not found");return{content:e,container:t.content.firstElementChild,list:t.content.querySelector(".toc__list"),toggleButton:t.content.querySelector(".toc__toggle"),headings:o}}setup(){const t=this.container.querySelector(".toc__title");t.textContent=this.options.title,t.style.setProperty("color","var(--toc__title-color, revert-layer)"),this.toggleButton.addEventListener("click",this.toggleTOC.bind(this))}toggleTOC(t){t.preventDefault(),this.list.classList.toggle("toc__list-collapsed"),this.toggleButton.classList.toggle("toc__toggle-collapsed"),this.toggleButton.setAttribute("aria-expanded","true"===this.toggleButton.getAttribute("aria-expanded")?"false":"true")}populateTOC(t){const e=[];t.forEach((t=>{const o=parseInt(t.tagName[1],10);for(t.id||(t.id=this.generateHeadingId(t));e.length&&e[e.length-1].level>=o;)e.pop();const n=document.createElement("li"),i=this.createLink(t);if(n.appendChild(i),e.length){let t=e[e.length-1].element.querySelector("ol");t||(t=document.createElement("ol"),e[e.length-1].element.appendChild(t)),t.appendChild(n)}else this.list.appendChild(n);e.push({element:n,level:o})})),this.container.appendChild(this.list)}generateHeadingId(t){var e;let o=null==(e=t.textContent)?void 0:e.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");if(document.getElementById(o)){let t=2;for(;document.getElementById(`${o}-${t}`);)t++;o=`${o}-${t}`}return o}createLink(t){var e;const o=document.createElement("a");return o.style.setProperty("color","var(--toc__link-color, revert-layer)"),o.style.setProperty("font-size","var(--toc__link-size, 90%)"),o.href=`#${t.id}`,o.addEventListener("click",(e=>{e.preventDefault(),t.scrollIntoView({behavior:"smooth"}),o.classList.add("toc__link-visited"),history.pushState(null,"",`#${t.id}`)})),o.textContent=`${null==(e=t.textContent)?void 0:e.trim().replace(/\s+/g," ")}`,o}insertTOC(t){const e=t[0],o=null==e?void 0:e.parentElement;if(!o)throw new Error("No parent element found for headings");switch(this.options.position){case"beforefirstheading":o.insertBefore(this.container,e);break;case"afterfirstheading":o.insertBefore(this.container,null==e?void 0:e.nextElementSibling);break;case"afterfirstblock":o.insertBefore(this.container,o.children[1]);break;case"top":o.prepend(this.container);break;case"bottom":o.appendChild(this.container);break;default:const t=document.querySelector(this.options.position||"");if(!t)throw new Error(`Invalid selector for position: ${this.options.position}`);t.appendChild(this.container)}}addIndexes(){const t=this.container.querySelector("ol");t&&this.addIndex(t,"")}addIndex(t,e){const o=t.children;for(let n=0;n<o.length;n++){const t=o[n],i=`${e}${n+1}`,r=t.querySelector("a");r&&(r.innerHTML=`<span class="toc__list-index">${i}.</span> ${r.textContent}`);const a=t.querySelector("ol");a&&this.addIndex(a,`${i}.`)}}addStyles(t,e){Object.keys(e).forEach((o=>{const n=`--toc__${this.camelToSnakeCase(o)}`;t.style.setProperty(n,e[o])}))}scrollToCurrentHeading(){if(window.location.hash){const t=document.getElementById(window.location.hash.slice(1));t&&t.tagName.match(/^H[1-6]$/)&&window.addEventListener("load",(()=>{setTimeout((()=>{t.scrollIntoView({behavior:"instant"}),console.log("scrolling to current heading")}),1)}))}}camelToSnakeCase(t){return t.replace(/[A-Z]/g,(t=>`-${t.toLowerCase()}`))}addUtilityClasses(){if(!document.getElementById("toc-utility-styles")){const t=document.createElement("style");t.id="toc-utility-styles",t.innerHTML="#toc__container{display:inline-block;position:relative;background:var(--toc__background, rgb(0 0 0 / 3%));padding:var(--toc__padding, 14px 18px 18px);border-radius:var(--toc__border-radius, 5px);border:var(--toc__border, unset);margin:var(--toc__margin, 32px 0);width:var(--toc__width, auto)}#toc__container .toc__header{display:flex;justify-content:space-between;align-items:center}#toc__container .toc__header .toc__toggle{cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;border:none;background:none;transition:all .3s ease;margin:0 0 0 10px}#toc__container .toc__header .toc__toggle.toc__toggle-collapsed{transform:rotate(180deg)}#toc__container .toc__title{font-size:var(--toc__title-size, 100%)!important;margin:0!important;padding:0!important;line-height:unset}#toc__container ol.toc__list{margin:6px 0 0!important;padding:0!important;line-height:var(--toc__line-height, revert-layer);transition:var(--toc__transition, all .3s ease)}#toc__container ol{padding-left:var(--toc__list-padding, 14px)!important;margin:0!important;list-style-type:var(--toc__list-style-type, none)!important;list-style-position:var(--toc__list-style-position, inside)!important}#toc__container ol ::marker{color:var(--toc__list-marker-color, var(--toc__link-color, currentColor))}#toc__container a.toc__link-visited{opacity:.7}#toc__container a{cursor:pointer;box-shadow:none!important;border:none!important;text-decoration:none!important}#toc__container .toc__list a:hover{text-decoration:none!important;border-bottom:1px dotted!important}#toc__container .toc__list-index{color:var(--toc__index-color, currentColor)}#toc__container ol.toc__list.toc__list-collapsed{display:none!important}#toc__container ol.toc__list{animation:toc__appear .5s ease-in-out 1;transition-property:display,max-height;transition-duration:.5s;transition-behavior:allow-discrete;max-height:1000px}#toc__container ol.toc__list.toc__list-collapsed{animation:toc__disappear .5s ease-in-out 1;max-height:0}@keyframes toc__appear{0%{opacity:0;max-height:0}to{opacity:1;max-height:1000px}}@keyframes toc__disappear{0%{opacity:1;max-height:1000px;display:block!important}to{opacity:0;max-height:0;display:none!important}}",document.head.appendChild(t)}}}"undefined"!=typeof window&&(window.createTOC=function(t={}){new o(t)})}));
