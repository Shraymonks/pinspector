
class Model {
    constructor() {
        this._moduleMap = {};
        this._rootModule = null;
        this._selectedModule = null;
        this._user = null;
        this._context = null;
        this._subscribers = new Set();
    }

    get moduleMap() {
        return this._moduleMap;
    }

    set moduleMap(moduleMap) {
        this._moduleMap = moduleMap;
        this._notify();
    }

    get rootModule() {
        return this._rootModule;
    }

    set rootModule(module) {
        this._rootModule = module;
        this._notify();
    }

    get selectedModule() {
        return this._selectedModule;
    }

    set selectedModule(module) {
        this._selectedModule = module;
        this._notify();
    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
        this._notify();
    }

    get context() {
        return this._context;
    }

    set context(context) {
        this._context = context;
        this._notify();
    }

    _notify() {
        this._subscribers.forEach((callback) => callback());
    }

    subscribe(callback) {
        this._subscribers.add(callback);
        return callback;
    }

    unsubscribe(callback) {
        this._subscribers.delete(callback);
    }
}

export default new Model();
