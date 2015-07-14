import React from 'react';

import Model from './Model';

class ModelDependentComponent extends React.Component {
    constructor(props, ...keys) {
        super(props);
        this.state = {
            _model_callback: null,
            _model_keys: keys
        };
        keys.forEach((key) => this.state[key] = Model[key]);
    }

    _fetchState() {
        var keys = this.state._model_keys;
        this.setState(keys.reduce(
            (stateDict, key) => {
                stateDict[key] = Model[key];
                return stateDict;
            }, {}
        ));
    }

    componentDidMount() {
        var _model_callback = Model.subscribe(() => {
            this._fetchState();
        });
        this.setState({_model_callback});
    }

    componentWillUnmount() {
        Model.unsubscribe(this.state._model_callback);
        this.setState({_model_callback: null});
    }

    componentWillReceiveProps(nextProps) {
        this._fetchState();
    }
}

export default ModelDependentComponent;
