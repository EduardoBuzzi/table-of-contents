# table-of-contents

_A Dynamic Table of Contents Generator written in TypeScript for Your Web Pages_

## Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
    - [Options](#options)
      - [Styling via JavaScript Options](#styling-via-javascript-options)
      - [Styling via Pure CSS](#styling-via-pure-css)
- [Examples](#examples)
- [License](#license)

## Introduction

A TypeScript library to dynamically create a Table of Contents based on the headings within the content of a webpage. This library enhances navigation in long documents by generating a hierarchical and interactive structure of links that smoothly scroll to the desired section.

## Installation

Initially, you can download the file located at 'dist/table-of-contents.umd.js' and import it into your page like this:
```html
<script src="/js/table-of-contents.umd.js" type="text/javascript" charset="utf-8"></script>
```
Or you can simply copy the file contents and place them inside a script tag:
```html
<script type="text/javascript" charset="utf-8">
//... paste here
</script>
```
The library will be available in the global window context as createTOC.

## Usage

Create the Table of Contents by accessing this function:

```html
<script type="text/javascript" charset="utf-8">
    document.addEventListener('DOMContentLoaded', () => {
        window.createTOC();
    });
</script>
```

### Options

The 'createTOC' function accepts an options object to customize the Table of Contents. 
Here are the available options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| content | string or HTMLElement | `document.body` | The container that holds the headings to be indexed. |
| headers | string | `'h1, h2, h3, h4, h5, h6'` | The header selectors to include in the Table of Contents. |
| title | string | `'Contents'` | The title of the Table of Contents. |
| position | string | `'beforefirstheading'` | The position of the Table of Contents. Options include `'beforefirstheading'`, `'afterfirstheading'`, `'afterfirstblock'`, `'top'`, `'bottom'`, or a CSS selector for a custom position. |
| index | boolean | `true` | Whether to add numbered indexes to the items in the Table of Contents. |
| styles | object | `{}` | An object containing custom CSS styles for the Table of Contents. See [here](#styling-via-javascript-options). If you don't pass any attributes, the table of contents will follow the current page styles. |

#### Styling via JavaScript Options

You can customize the appearance of the Table of Contents by passing a styles object in the options. Here are some of the styles you can set:

- `titleColor`: Color of the title text.
- `titleSize`: Font size of the title.
- `titleWeight`: Font weight of the title.
- `linkColor`: Color of the links.
- `linkSize`: Font size of the links.
- `linkWeight`: Font weight of the links.
- `lineHeight`: Line height of the links.
- `indexColor`: Color of the index numbers.
- `listPadding`: Padding of the list.
- `background`: Background color of the Table of Contents.
- `border`: Border style of the Table of Contents.
- `borderRadius`: Border radius of the Table of Contents.
- `padding`: Padding inside the Table of Contents.
- `margin`: Margin outside the Table of Contents.
- `width`: Width of the Table of Contents.

#### Styling via Pure CSS

You can also style the Table of Contents using pure CSS. The following CSS variables are available for customization:

```css
.toc__container {
    --toc__title-color: white;
    --toc__title-size: 1rem;
    --toc__title-weight: 500;
    --toc__link-color: #01bdff;
    --toc__link-size: 90%;
    --toc__link-weight: 400;
    --toc__line-height: 1.5;
    --toc__index-color: white;
    --toc__list-padding: 14px;
    --toc__list-style-type: circle;
    --toc__list-style-position: inside;
    --toc__list-marker-color: white;
    --toc__toggle-color: #787878;
    --toc__background: #242424;
    --toc__border: 1px solid #03bcff;
    --toc__border-radius: 5px;
    --toc__padding: 14px 18px 18px;
    --toc__margin: 32px 0;
    --toc__width: auto;
}
```

You can override these variables in your own CSS file to customize the appearance of the Table of Contents.

## Examples

Here are some usage examples:

### Example 1: Table of Contents with custom title and headers
```javascript
createTOC({
    content: '#my-article',
    title: 'Summary',
    headers: 'h2, h3'
});
```
### Example 2: Table of Contents with custom position and styles
```javascript
createTOC({
    content: '#my-article',
    position: '#custom-toc-location',
    styles: {
        titleColor: 'white',
        titleSize: '1.2em',
        titleWeight: '500',
        linkColor: '#03bcff',
        linkSize: '0.9em',
        linkWeight: '500',
        lineHeight: '1.5em',
        indexColor: 'white',
        listPadding: '14px',
        listStyleType: 'circle',
        listStylePosition: 'inside',
        listMarkerColor: 'white',
        toggleColor: '#03bcff',
        background: '#242424',
        border: '1px solid #03bcff',
        borderRadius: '5px',
        padding: '14px 18px 18px',
        margin: '32px 0',
        width: '100%',
    }
});
```

## License

Open-sourced software licensed under the [MIT license](LICENSE).
