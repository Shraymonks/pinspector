import React from 'react';
import ModuleTree from './ModuleTree';

// CSS
import 'normalize.css';
import '../styles/main.css';

class PinspectorApp extends React.Component {
  render() {
    return (
      <ModuleTree module={this.props.module} />
    );
  }
}

function render(app) {
  React.render(<PinspectorApp module={app} />, document.getElementById('content'));
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

      return {
          name: module.className,
          children: children
      };
  })(P.app)`,
  (response) => {
    render(response);
});

export default PinspectorApp;
