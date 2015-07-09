'use strict';

describe('PinspectorApp', () => {
  let React = require('react/addons');
  let PinspectorApp, component;

  beforeEach(() => {
    let container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    PinspectorApp = require('components/PinspectorApp.js');
    component = React.createElement(PinspectorApp);
  });

  it('should create a new instance of PinspectorApp', () => {
    expect(component).toBeDefined();
  });
});
