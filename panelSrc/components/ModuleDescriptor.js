import React from 'react';

class ModuleDescriptor extends React.Component {
    render() {
        if (!this.props.module || !this.props.module.options) {
            return null;
        }
        
        var {text, alt} = this.props.module.options;
        return (
            <span className="desc">
                {text || alt}
            </span>
        );
    }
}
ModuleDescriptor.propTypes = {
    module: React.PropTypes.object
};

export default ModuleDescriptor;
