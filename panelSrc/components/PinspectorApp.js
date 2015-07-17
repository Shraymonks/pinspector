import React from 'react';

import {constructModuleTree} from '../EvalUtils';
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
        super(props, 'moduleMap', 'rootModule', 'selectedModule', 'user', 'context');

        this.handleTreeAction = this.handleTreeAction.bind(this);
        this.selectModuleFromElement = this.selectModuleFromElement.bind(this);
    }

    selectOther(name) {
        Model.selectedModule = {
            cid: `gangsta.${name}`,
            name: name,
            data: this.state[name.toLowerCase()],
            resource: null,
            options: null,
            extraData: null
        }
        this.refs.splitPane.open();
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
        this.refs.splitPane.open();
    }

    handleTreeAction() {
        this.refs.splitPane.open();
    }

    render() {
        return (
            <div className="fill">
                <SplitPane
                    leftPane={
                        <div className="modules">
                            <div className="parent user" onClick={this.selectOther.bind(this, 'User')}>
                                User
                            </div>
                            <div className="parent context" onClick={this.selectOther.bind(this, 'Context')}>
                                Context
                            </div>
                            <ol className="module-tree">
                                <ModuleTree
                                    handleAction={this.handleTreeAction}
                                    module={this.state.rootModule}
                                />
                            </ol>
                        </div>
                    }
                    ref="splitPane"
                    rightPane={
                        <div className="module-edit">
                            <ModuleEdit module={this.state.selectedModule} />
                        </div>
                    }
                />
                <SearchBar root={document.querySelectorAll(".parent span")}/>
            </div>
        );
    }
}

function updateModel(options) {
    Model.moduleMap = options.moduleMap;
    Model.rootModule = options.module;
    Model.user = options.user;
    Model.context = options.context;
}

function initBackgroundConnection() {
    const backgroundPageConnection = chrome.runtime.connect({
        name: "panel"
    });

    let debounce;

    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    });

    backgroundPageConnection.onMessage.addListener((message) => {
        clearTimeout(debounce);
        debounce = setTimeout(initialize, 50);
    });
}

function initialize() {
    constructModuleTree(updateModel);
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

initialize();
initBackgroundConnection();

export default PinspectorApp;
