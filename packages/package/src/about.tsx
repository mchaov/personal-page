
import * as React from "react";
import * as ReactDOM from "react-dom";

import "./about.less";
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

            <div>ABOUT</div>
        </>
    }
}

export function init(domId: string) {
    ReactDOM.render(
        <App />,
        document.getElementById(domId)
    )
}

window["init"] = init;
