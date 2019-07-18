
class Component {

    constructor() {
        this._proxies = new Map();
        this._watched = new Map();
        this._dirtyProps = new Set();
        this._callbacks = new Map();
    }

    //Simulate loop which is usually called every frame or less according to the life cycle of UI Framework
    step() {
        this._detectChanges();
    }

    watch(prop, func) {
        const val = this[prop];
        if (this._watched.has(prop)) {
            return;
        }

        this._callbacks.set(prop, func);

        this._watchForDirectAssignment(prop);
        this._watchForObjectManipulation(prop, val);

        this._watched.set(prop, {
            dirty: false,
            val: val
        });
    }

    _watchForDirectAssignment(prop) {
        Object.defineProperty(this, prop, {
            get: () => {
                return this._proxies.get(prop);
            },
            set: (value) => {
                this._updateProp(prop, value);
                this._watchForObjectManipulation(prop, value);
            }
        });
    }

    _watchForObjectManipulation(prop, val) {
        if (Array.isArray(val)) {
            this._setArrayListener(prop, val);
            return;
        }

        if (this._isNotNullObject(val)) {
            this._setObjectListener(prop, val);
            return;
        }

        this._proxies.set(prop, val);
    }

    _setArrayListener(prop, val) {
        this._proxies.set(prop,
            new Proxy(val, {
                set: (obj, objProp, value) => {
                    if (Number.isInteger(Number(objProp))) {
                        this._updateProp(prop, obj);
                        obj[objProp] = value;
                        return true;
                    }
                    obj[objProp] = value;
                    return true;
                }
            })
        );
    }

    _setObjectListener(prop, val) {
        this._proxies.set(prop,
            new Proxy(val, {
                set: (obj, objProp, value) => {
                    this._updateProp(prop, obj);
                    obj[objProp] = value;
                    return true;
                }
            })
        );
    }

    _updateProp(prop, value) {
        if (this._watched.get(prop).dirty) {
            this._watched.get(prop).val = value;
            return;
        }

        const old = this._watched.get(prop).val;
        this._watched.set(prop, {
            old: this._copy(old),
            dirty: true,
            val: value
        });
        this._dirtyProps.add(prop);
    }

    _copy(old) {
        if (Array.isArray(old)) {
            return [...old];
        }

        if (this._isNotNullObject(old)) {
            return Object.assign(Object.create(Object.getPrototypeOf(old)), old);
        }

        return old;
    }

    _isNotNullObject(val) {
        return typeof (val) === "object" && val !== null;
    }

    _detectChanges() {
        for (const prop of this._dirtyProps) {
            if (!this._checkEquality(prop)) {
                this.dispatch(prop);
            }
            this._watched.get(prop).dirty = false;
            this._dirtyProps.delete(prop);
        }
    }

    _checkEquality(prop) {
        const watchedData = this._watched.get(prop);

        if (!watchedData.dirty) throw new Error("Only dirty props must be passed");

        const { old, val } = watchedData;

        //Handle NaN as same value
        if (Object.is(old, val)) {
            return true;
        }

        if (typeof (old) !== typeof (val)) {
            return false;
        }

        if (Array.isArray(old)) {
            return this._compareArray(old, val);
        }

        if (this._isNotNullObject(old)) {
            return this.compareObject(old, val);
        }

        return false;
    }

    _compareArray(a, b) {
        if (a.length !== b.length) return false;

        for (let k in a) {
            if (a[k] !== b[k]) {
                return false;
            }
        }
        return true;
    }

    compareObject(a, b) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }

        if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
            return false;
        }

        for (let k in a) {
            if (a[k] !== b[k]) {
                return false;
            }
        }
        return true;
    }

    dispatch(prop) {
        const { old, val } = this._watched.get(prop);

        const callback = this._callbacks.get(prop);
        callback(prop, {
            old: old,
            val: val
        });
    }
}

module.exports = Component;
