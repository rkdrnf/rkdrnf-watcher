const TestComponent = require("./testComponent");

function setupComp() {
    const comp = new TestComponent();

    comp.testArr = [];
    comp.testObj = {};
    comp.testNumber = 0;
    comp.testString = "";

    return comp;
}

function logChanges(testName, prop, changes) {
    const { old, val } = changes;
    console.log(`#${testName}\n [${prop}] changed from: ${JSON.stringify(old)}, to: ${JSON.stringify(val)}`);
}

test1Name = 'Assign object of same type';
test1LogFunc = (prop, d) => logChanges(test1Name, prop, d);
test(test1Name, () => {
    const comp = setupComp();

    const arrCallback = jest.fn(test1LogFunc);
    const objCallback = jest.fn(test1LogFunc);
    const numberCallback = jest.fn(test1LogFunc);
    const stringCallback = jest.fn(test1LogFunc);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);
    comp.watchForTest("testNumber", numberCallback);
    comp.watchForTest("testString", stringCallback);

    comp.testArr = [1, 2, 3];
    comp.testObj = { a: 1, b: 2, c: 3 };
    comp.testNumber = 1;
    comp.testString = "test"

    comp.step();

    expect(arrCallback.mock.calls[0][1]).toEqual({
        old: [],
        val: [1, 2, 3]
    });
    expect(objCallback.mock.calls[0][1]).toEqual({
        old: {},
        val: { a: 1, b: 2, c: 3 }
    });
    expect(numberCallback.mock.calls[0][1]).toEqual({
        old: 0,
        val: 1
    });
    expect(stringCallback.mock.calls[0][1]).toEqual({
        old: "",
        val: "test"
    });
});

test2Name = 'Assign object of different type';
test2LogFunc = (prop, d) => logChanges(test2Name, prop, d);
test(test2Name, () => {
    const comp = setupComp();

    const arrCallback = jest.fn(test2LogFunc);
    const objCallback = jest.fn(test2LogFunc);
    const numberCallback = jest.fn(test2LogFunc);
    const stringCallback = jest.fn(test2LogFunc);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);
    comp.watchForTest("testNumber", numberCallback);
    comp.watchForTest("testString", stringCallback);

    comp.testArr = { a: 1 };
    comp.testObj = "abc";
    comp.testNumber = [1, 2, 3];
    comp.testString = 3;

    comp.step();

    expect(arrCallback.mock.calls[0][1]).toEqual({
        old: [],
        val: { a: 1 }
    });
    expect(objCallback.mock.calls[0][1]).toEqual({
        old: {},
        val: "abc"
    });
    expect(numberCallback.mock.calls[0][1]).toEqual({
        old: 0,
        val: [1, 2, 3]
    });
    expect(stringCallback.mock.calls[0][1]).toEqual({
        old: "",
        val: 3
    });
});

test3Name = 'Add key to object';
test3LogFunc = (prop, d) => logChanges(test3Name, prop, d);
test(test3Name, () => {
    const comp = setupComp();

    const arrCallback = jest.fn(test3LogFunc);
    const objCallback = jest.fn(test3LogFunc);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);

    comp.testArr.push(1);
    comp.testObj.a = 1;

    comp.step();

    expect(arrCallback.mock.calls[0][1]).toEqual({
        old: [],
        val: [1]
    });
    expect(objCallback.mock.calls[0][1]).toEqual({
        old: {},
        val: { a: 1 }
    });
});

test4Name = 'Change existing key';
test4LogFunc = (prop, d) => logChanges(test4Name, prop, d);
test(test4Name, () => {
    const comp = setupComp();

    comp.testArr = [1, 2, 3]
    comp.testObj = { a: 1, b: 2, c: 3 }

    const arrCallback = jest.fn(test4LogFunc);
    const objCallback = jest.fn(test4LogFunc);

    comp.watchForTest("testArr", arrCallback);
    comp.watchForTest("testObj", objCallback);

    comp.testArr[0] = 4;
    comp.testObj.a = 4;

    comp.step();

    expect(arrCallback.mock.calls[0][1]).toEqual({
        old: [1, 2, 3],
        val: [4, 2, 3]
    });
    expect(objCallback.mock.calls[0][1]).toEqual({
        old: { a: 1, b: 2, c: 3 },
        val: { a: 4, b: 2, c: 3 }
    });
});

test5Name = 'Assign same value';
test5LogFunc = (prop, d) => logChanges(test5Name, prop, d);
test(test5Name, () => {
    const comp = setupComp();

    const arrCallback = jest.fn(test5LogFunc);
    const objCallback = jest.fn(test5LogFunc);
    const numberCallback = jest.fn(test5LogFunc);
    const stringCallback = jest.fn(test5LogFunc);

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

test6Name = 'Do nothing';
test6LogFunc = (prop, d) => logChanges(test6Name, prop, d);
test(test6Name, () => {
    const comp = setupComp();

    const arrCallback = jest.fn(test6LogFunc);
    const objCallback = jest.fn(test6LogFunc);
    const numberCallback = jest.fn(test6LogFunc);
    const stringCallback = jest.fn(test6LogFunc);

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

test7Name = 'Multiple Loop';
test7LogFunc = (prop, d) => logChanges(test7Name, prop, d);
test(test7Name, () => {
    const comp = setupComp();

    const objCallback = jest.fn(test7LogFunc);

    comp.watchForTest("testObj", objCallback);

    comp.testObj = { a: 1, b: 2, c: 3 };

    comp.step();
    comp.step();
    comp.step();
    comp.step();

    expect(objCallback.mock.calls.length).toBe(1);
});

test8Name = 'Multiple Loop2';
test8LogFunc = (prop, d) => logChanges(test8Name, prop, d);
test(test8Name, () => {
    const comp = setupComp();

    const objCallback = jest.fn(test8LogFunc);

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

test9Name = 'Change old object';
test9LogFunc = (prop, d) => logChanges(test9Name, prop, d);
test(test9Name, () => {
    const comp = setupComp();

    const objCallback = jest.fn(test9LogFunc);

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

test10Name = 'Preserve old value through multiple changes in a single loop';
test10LogFunc = (prop, d) => logChanges(test10Name, prop, d);
test(test10Name, () => {
    const comp = setupComp();

    const objCallback = jest.fn(test10LogFunc);

    comp.watchForTest("testObj", objCallback);

    comp.testObj = { a: 1, b: 2, c: 3 };
    comp.testObj = { p: 1, q: 2, r: 3 };
    comp.step();

    expect(objCallback.mock.calls.length).toBe(1);
    expect(objCallback.mock.calls[0][1]).toEqual({
        old: {},
        val: { p: 1, q: 2, r: 3 }
    });
});