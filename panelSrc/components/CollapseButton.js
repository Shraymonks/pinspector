import React from 'react';

class CollapseButton extends React.Component {
    render() {
        var icon = this.props.collapsed ? '▶' : '▼';
        return (
            <span
                className="collapse-button"
                onClick={this.props.click}>
                {icon}
            </span>
        );
    }
}
CollapseButton.propTypes = {
    collapsed: React.PropTypes.bool,
    click: React.PropTypes.func
};

export default CollapseButton;
