'use strict';

var React = require('react/addons');

import ModuleTree from './ModuleTree';

// CSS
require('normalize.css');
require('../styles/main.css');

var PinspectorApp = React.createClass({
  render: function() {
    return (
      <ModuleTree module={this.props.module} />
    );
  }
});

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

module.exports = PinspectorApp;
