import React from 'react';

class ModuleDescriptor extends React.Component {
    render() {
        var module = this.props.module;
        if (!module || !module.options) {
            return null;
        }

        if (module.name === 'Pin') {
            let images = module.data.images;
            let src = images['136x136'].url;
            return (
                <img className="desc-img" src={src} />
            );
        } else if (module.name === 'Board') {
            let src = module.data.image_thumbnail_url;
            return (
                <img className="desc-img" src={src} />
            )
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
