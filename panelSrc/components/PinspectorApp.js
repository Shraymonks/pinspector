import React from 'react';

import ModuleTree from './ModuleTree';
import SplitPane from './SplitPane';

// CSS
import 'normalize.css';
import '../styles/main.css';

class PinspectorApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedModule: this.props.rootModule,
            selectedElement: null
        };
    }

    setSelectedModule(selectedModule) {
        this.setState({selectedModule});
    }

    render() {
        return (
            <SplitPane
                leftPane={
                    <div className="modules">
                        <ol className="module-tree">
                            <ModuleTree module={this.props.rootModule}
                                selectedModule={this.state.selectedModule}
                                onSelect={this.setSelectedModule.bind(this)} />
                        </ol>
                    </div>
                }
            />
        );
    }
}
PinspectorApp.propTypes = {
    rootModule: React.PropTypes.object.isRequired
};

function render(module) {
    React.render(
        <PinspectorApp rootModule={module}/>,
        document.getElementById('content')
    );
}

chrome.devtools.inspectedWindow.eval(`
  (function getModules(module) {
      if (!module) {
          return null;
      }

      var children = module.children ?
          module.children.map(function(child) {
              return getModules(child);
          }) : [];

      // Store cid for lookup
      module.$el.attr('cid', module.cid);
      return {
          name: module.className,
          cid: module.cid,
          children: children
      };
  })(P.app)`, render);

export default PinspectorApp;
