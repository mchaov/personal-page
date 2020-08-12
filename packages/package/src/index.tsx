// import React from "react";
// import { Component } from "react";
// import { render } from "react-dom";
// import { observable, action } from "mobx";
// import { observer } from "mobx-react";

// @ts-ignore
import Test from "../pages/test.md";

console["log"](Test);

import "./index.less";
import "highlight.js/styles/github.css";
import "../../../node_modules/github-markdown-css/github-markdown.css"

// class TestState {
//     private timeout: any;
//     @observable count: number = 0;

//     constructor() {
//         this.timeout = this.start();
//     }

//     start = () => {
//         clearTimeout(this.timeout);
//         this.timeout = setTimeout(this.start, 1000);
//     }

//     @action inc() {
//         this.count += 1;
//     }
// }

// @observer
// class Test extends Component<{ state: TestState }, TestState> {
//     constructor(props) {
//         super(props);
//         this.state = this.props.state
//     }
//     render() {
//         return <div>test</div>
//     }
// }

export function init(domId: string) {
    document.body.innerHTML = `
    <div class="markdown-body">
    ${Test}
    </div>
    `;
    console["log"]("init", domId);
    // render(<Test state={new TestState()} />, document.getElementById(domId));
}

// window["init"] = init;
