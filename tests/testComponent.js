
const Component = require("../src/component");

class TestComponent extends Component {

    constructor() {
        super();
    }

    onStart() {
    }

    onUIEvent() {
    }

    watchForTest(prop, func) {
        this.watch(prop, func);
    }
}


module.exports = TestComponent