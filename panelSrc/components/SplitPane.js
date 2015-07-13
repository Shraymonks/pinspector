import React from 'react';

class SplitPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {leftWidth: 350};

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    mouseDown() {
        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseUp);
    }

    mouseMove(event) {
        this.setState({leftWidth: event.pageX});
    }

    mouseUp() {
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);
    }

    render() {
        let leftStyle = {
            width: this.state.leftWidth + 'px'
        };

        let separatorStyle = {
            left: this.state.leftWidth + 'px'
        };

        let rightStyle = {
            width: 'calc(100% - ' + this.state.leftWidth + 'px)'
        };

        return (
            <div className="split-pane">
                <div className="left-pane" style={leftStyle}>{this.props.leftPane}</div>
                <div className="separator" onMouseDown={this.mouseDown} style={separatorStyle}></div>
                <div className="right-pane" ref="right" style={rightStyle}>{this.props.rightPane}</div>
            </div>
        );
    }
}

export default SplitPane;
