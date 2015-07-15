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
        super(props, 'moduleMap', 'rootModule', 'selectedModule', 'user');

        this.handleTreeAction = this.handleTreeAction.bind(this);
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
                            <div className="parent user" onClick={this.selectUser.bind(this)}>
                                User
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
// var debounced = null;
// chrome.devtools.inspectedWindow.onResourceAdded.addListener(function() {
//     clearTimeout(debounced);
//     debounced = setTimeout(initialize, 50);
// });
initialize();

export default PinspectorApp;
