const TestComponent = require("./testComponent");

function setupComp() {
    const comp = new TestComponent();

    comp.testArr = [];
    comp.testObj = {};
    comp.testNumber = 0;
    comp.testString = "";

    return comp;
}

test('Assign object of same type', () => {
    const comp = setupComp();

    const arrCallback = jest.fn(d => d);
    const objCallback = jest.fn(d => d);
    const numberCallback = jest.fn(d => d);
    const stringCallback = jest.fn(d => d);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);
    comp.watchForTest("testNumber", numberCallback);
    comp.watchForTest("testString", stringCallback);

    comp.testArr = [1, 2, 3];
    comp.testObj = { a: 1, b: 2, c: 3 };
    comp.testNumber = 1;
    comp.testString = "test"

    comp.step();

    expect(arrCallback.mock.calls[0][0]).toEqual({
        old: [],
        val: [1, 2, 3]
    });
    expect(objCallback.mock.calls[0][0]).toEqual({
        old: {},
        val: { a: 1, b: 2, c: 3 }
    });
    expect(numberCallback.mock.calls[0][0]).toEqual({
        old: 0,
        val: 1
    });
    expect(stringCallback.mock.calls[0][0]).toEqual({
        old: "",
        val: "test"
    });
});

test('Assign object of different type', () => {
    const comp = setupComp();

    const arrCallback = jest.fn(d => d);
    const objCallback = jest.fn(d => d);
    const numberCallback = jest.fn(d => d);
    const stringCallback = jest.fn(d => d);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);
    comp.watchForTest("testNumber", numberCallback);
    comp.watchForTest("testString", stringCallback);

    comp.testArr = { a: 1 };
    comp.testObj = "abc";
    comp.testNumber = [1, 2, 3];
    comp.testString = 3;

    comp.step();

    expect(arrCallback.mock.calls[0][0]).toEqual({
        old: [],
        val: { a: 1 }
    });
    expect(objCallback.mock.calls[0][0]).toEqual({
        old: {},
        val: "abc"
    });
    expect(numberCallback.mock.calls[0][0]).toEqual({
        old: 0,
        val: [1, 2, 3]
    });
    expect(stringCallback.mock.calls[0][0]).toEqual({
        old: "",
        val: 3
    });
});

test('Add key to object', () => {
    const comp = setupComp();

    const arrCallback = jest.fn(d => d);
    const objCallback = jest.fn(d => d);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);

    comp.testArr.push(1);
    comp.testObj.a = 1;

    comp.step();

    expect(arrCallback.mock.calls[0][0]).toEqual({
        old: [],
        val: [1]
    });
    expect(objCallback.mock.calls[0][0]).toEqual({
        old: {},
        val: { a: 1 }
    });
});

test('Change existing key', () => {
    const comp = setupComp();

    comp.testArr = [1, 2, 3]
    comp.testObj = { a: 1, b: 2, c: 3 }

    const arrCallback = jest.fn(d => d);
    const objCallback = jest.fn(d => d);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);

    comp.testArr[0] = 4;
    comp.testObj.a = 4;

    comp.step();

    expect(arrCallback.mock.calls[0][0]).toEqual({
        old: [1, 2, 3],
        val: [4, 2, 3]
    });
    expect(objCallback.mock.calls[0][0]).toEqual({
        old: { a: 1, b: 2, c: 3 },
        val: { a: 4, b: 2, c: 3 }
    });
});

test('Assign same value', () => {
    const comp = setupComp();

    const arrCallback = jest.fn(d => d);
    const objCallback = jest.fn(d => d);
    const numberCallback = jest.fn(d => d);
    const stringCallback = jest.fn(d => d);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);
    comp.watchForTest("testNumber", numberCallback);
    comp.watchForTest("testString", stringCallback);

    comp.testArr = [];
    comp.testObj = {};
    comp.testNumber = 0;
    comp.testString = "";

    comp.step();

    expect(arrCallback.mock.calls.length).toBe(0);
    expect(objCallback.mock.calls.length).toBe(0);
    expect(numberCallback.mock.calls.length).toBe(0);
    expect(stringCallback.mock.calls.length).toBe(0);

});

test('Do nothing', () => {
    const comp = setupComp();

    const arrCallback = jest.fn(d => d);
    const objCallback = jest.fn(d => d);
    const numberCallback = jest.fn(d => d);
    const stringCallback = jest.fn(d => d);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);
    comp.watchForTest("testNumber", numberCallback);
    comp.watchForTest("testString", stringCallback);

    comp.step();

    expect(arrCallback.mock.calls.length).toBe(0);
    expect(objCallback.mock.calls.length).toBe(0);
    expect(numberCallback.mock.calls.length).toBe(0);
    expect(stringCallback.mock.calls.length).toBe(0);
});

test('Multiple Loop', () => {
    const comp = setupComp();

    const objCallback = jest.fn(d => d);

    comp.watchForTest("testObj", objCallback);

    comp.testObj = { a: 1, b: 2, c: 3 };

    comp.step();
    comp.step();
    comp.step();
    comp.step();

    expect(objCallback.mock.calls.length).toBe(1);
});

test('Multiple Loop2', () => {
    const comp = setupComp();

    const objCallback = jest.fn(d => d);

    comp.watchForTest("testObj", objCallback);

    comp.testObj = { a: 1 };
    comp.step();
    comp.testObj = { a: 2 };
    comp.step();
    comp.testObj = { a: 3 };
    comp.step();
    comp.testObj = { a: 4 };
    comp.step();

    expect(objCallback.mock.calls.length).toBe(4);
});

test('Change old object', () => {
    const comp = setupComp();

    const objCallback = jest.fn(d => d);

    comp.watchForTest("testObj", objCallback);

    var old = { a: 1, b: 2, c: 3 };
    comp.testObj = old;
    comp.step();

    comp.testObj = { p: 1, q: 2, r: 3 };
    comp.step();

    //This must not trigger event
    old.a = 4;
    comp.step();

    expect(objCallback.mock.calls.length).toBe(2);
});

test('Preserve old value through multiple changes in a single loop', () => {
    const comp = setupComp();

    const objCallback = jest.fn(d => d);

    comp.watchForTest("testObj", objCallback);

    comp.testObj = { a: 1, b: 2, c: 3 };
    comp.testObj = { p: 1, q: 2, r: 3 };
    comp.step();

    expect(objCallback.mock.calls.length).toBe(1);
    expect(objCallback.mock.calls[0][0]).toEqual({
        old: {},
        val: { p: 1, q: 2, r: 3 }
    });
});