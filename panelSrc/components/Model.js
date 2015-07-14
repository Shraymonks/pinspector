
class Model {
    constructor() {
        this._rootModule = null;
        this._selectedModule = null;
        this._user = null;
        this._subscribers = new Set();
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
