
class Model {
    constructor() {
        this._selectedModule = null;
        this._subscribers = new Set();
    }

    get selectedModule() {
        return this._selectedModule;
    }

    set selectedModule(module) {
        this._selectedModule = module;
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
