
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Pages } from "./pages";

import "./index.less";
import "highlight.js/styles/github.css";
import "../../../node_modules/github-markdown-css/github-markdown.css"


class App extends React.Component<{}, {}>{
    constructor(props) {
        super(props)
    }

    render() {
        return <>
            <h1>
                Top
            </h1>
            
            <div
                className="markdown-body"
                dangerouslySetInnerHTML={{
                    __html: Pages.test
                }}>
            </div>
        </>
    }
}

export function init(domId: string) {
    ReactDOM.render(
        <App />,
        document.getElementById(domId)
    )
}
