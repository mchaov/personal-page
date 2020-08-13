import { IPage } from "../types";

const Test = props => {
    console["log"](props);
    return <div>test</div>
}

export class Page implements IPage {
    path: string = "/test"
    component: JSX.Element = <Test></Test>
    constructor() {

    }
}