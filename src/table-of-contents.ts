import { Options } from './types.ts'
import { TableOfContents } from './classes.ts'

function createTOC(options: Options = {}) {
    new TableOfContents(options)
}

if (typeof (window) !== 'undefined') {
	window.createTOC = createTOC
}