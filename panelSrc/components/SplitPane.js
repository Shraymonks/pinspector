import React from 'react';

class SplitPane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            leftWidth: '100%',
            rightWidth: '100px',
            transition: 'width 250ms'
        };

        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.open = this.open.bind(this);
    }

    componentDidMount() {
        React.findDOMNode(this.refs.leftPane).addEventListener('transitionend', () => {
            this.setState({transition: 'none'});
        });
    }

    mouseDown() {
        document.addEventListener('mousemove', this.mouseMove);
        document.addEventListener('mouseup', this.mouseUp);
    }

    mouseMove(event) {
        this.setState({leftWidth: `${event.pageX}px`});
    }

    mouseUp() {
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);
    }

    open() {
        if (this.state.leftWidth === '100%') {
            this.setState({
                leftWidth: '350px',
                rightWidth: null
            });
        }
    }

    render() {
        let leftStyle = {
            transition: this.state.transition,
            width: this.state.leftWidth
        };

        let separatorStyle = {
            left: this.state.leftWidth
        };

        let rightStyle = {
            transition: this.state.transition,
            width: this.state.rightWidth || `calc(100% - ${this.state.leftWidth})`
        };

        return (
            <div className="split-pane">
                <div className="left-pane" ref="leftPane" style={leftStyle}>{this.props.leftPane}</div>
                <div className="separator" onMouseDown={this.mouseDown} style={separatorStyle}></div>
                <div className="right-pane" style={rightStyle}>{this.props.rightPane}</div>
            </div>
        );
    }
}

export default SplitPane;
