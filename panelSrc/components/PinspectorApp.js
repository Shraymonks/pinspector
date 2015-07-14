import React from 'react';

import Model from './Model';
import ModelDependentComponent from './ModelDependentComponent';
import ModuleTree from './ModuleTree';
import ModuleEdit from './ModuleEdit';
import SplitPane from './SplitPane';
import SearchBar from './SearchBar';

// CSS
import 'normalize.css';
import '../styles/main.css';

class PinspectorApp extends ModelDependentComponent {
    constructor(props) {
        super(props, 'moduleMap', 'rootModule', 'selectedModule', 'user');

        this.selectModuleFromElement = this.selectModuleFromElement.bind(this);
    }

    selectUser() {
        Model.selectedModule = {
            name: 'User',
            data: this.state.user,
            resource: null,
            options: null,
            extraData: null
        }
    }

    selectModuleFromElement() {
        chrome.devtools.inspectedWindow.eval('getCid($0)', {useContentScriptContext: true}, (cid, exception) => {
            if (!exception && cid) {
                this.setSelectedModule(cid);
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.selectModuleFromElement();
        window.addEventListener('shown', this.selectModuleFromElement);
    }

    setSelectedModule(cid) {
        Model.selectedModule = Model.moduleMap[cid];
    }

    render() {
        return (
            <div className="fill">
            <SplitPane
                leftPane={
                    <div className="modules">
                        <div className="parent user" onClick={this.selectUser.bind(this)}>
                            User
                        </div>
                        <ol className="module-tree">
                            <ModuleTree module={this.state.rootModule} />
                        </ol>
                    </div>
                }
                rightPane={
                    <div className="module-edit">
                        <ModuleEdit module={this.state.selectedModule} />
                    </div>
                }
            />
            <SearchBar root={document.querySelectorAll(".parent")}/>
            </div>
        );
    }
}

function updateModel(options) {
    Model.moduleMap = options.moduleMap;
    Model.rootModule = options.module;
    Model.user = options.user;
}

function initialize() {
    chrome.devtools.inspectedWindow.eval(`
        (function(P) {
            if (!P) { return null; }

        var moduleMap = {};

        function getModules(module) {
            // Store cid for lookup
            module.$el.attr('cid', module.cid);

            var children = module.children.map(getModules);
            // TODO {zack} Find a way to do this better
            var whitelist = ['cid', 'data', 'options', 'resource', 'extraData', 'extraState'];
            var mod = Object.keys(module).reduce(function(obj, key) {
                if (whitelist.indexOf(key) !== -1) {
                    obj[key] = module[key];
                }
                return obj;
            }, { name: module.className, children: children });
            mod =  JSON.parse(JSON.stringify(mod, function(property, value) {
                if (value instanceof jQuery) {
                    return '<jQuery object>';
                }
                return value;
            }));
            moduleMap[mod.cid] = mod;
            return mod;
        }

        var module = getModules(P.app);

        return {
            module: module,
            moduleMap: moduleMap,
            user: P.currentUser
        }
      })(P)`, updateModel);
}

React.render(
    <PinspectorApp/>,
    document.getElementById('content')
);

/*
 * Reinitialize each time there is a route change or resource (node)
 * added to the DOM. This should account for full page reloads as well
 * as SPA route changes. Debounce the resource added otherwise it will
 * be fired like 100+ times...
 */
var debounced = null;
chrome.devtools.inspectedWindow.onResourceAdded.addListener(function() {
    clearTimeout(debounced);
    debounced = setTimeout(initialize, 50);
});
initialize();

export default PinspectorApp;
