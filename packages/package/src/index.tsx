import { Pages } from "./pages";

import "./index.less";
import "highlight.js/styles/github.css";
import "../../../node_modules/github-markdown-css/github-markdown.css"

export function init(domId: string) {
    document.body.innerHTML = `
    <div class="markdown-body">
    ${Pages.test}
    </div>
    `;
    console["log"]("init", domId);
}
