import React from 'react';

import Model from './Model';

class ModelDependentComponent extends React.Component {
    constructor(props, key) {
        super(props);
        this.state = {
            _model_callback: null,
            _model_key: key,
            [key]: Model[key]
        };
    }

    _fetchState() {
        var key = this.state._model_key;
        this.setState({
            [key]: Model[key]
        });
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
