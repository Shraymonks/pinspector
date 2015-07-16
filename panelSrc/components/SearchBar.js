import React from 'react';

class SearchBar extends React.Component {
    constructor() {
        super();
        this.state = {
            matchcount: 0,
            curmatch: 0,
            matchednodes: []
        };
    }

    debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
            };
            var call = !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (call) func.apply(context, args);
        };
    }

    jumpNext() {
        var next = this.state.curmatch >= this.state.matchcount ? 1 : this.state.curmatch + 1;
        this.setState({
            curmatch: next
        });
        this.state.matchednodes[this.state.curmatch - 1].scrollIntoView();
    }

    jumpPrev() {
        var prev = this.state.curmatch > 1 ? this.state.curmatch - 1 : this.state.matchcount;
        this.setState({
            curmatch: prev
        });
        this.state.matchednodes[this.state.curmatch - 1].scrollIntoView();
    }

    onKeyUp(evt) {
        if (this.props.root.length <= 0) {
            return;
        }

        var nodes = this.state.matchednodes;
        var charCode = (typeof evt.which === "number") ? evt.which : evt.keyCode;
        if (charCode === 13) { // enter key
            this.jumpNext();
        } else {
            nodes = [];
        }

        if (evt.target.value === '') {
            this.setState({
                matchcount: 0,
                curmatch: 0,
                matchednodes: []
            });
        } else if (nodes.length <= 0) {
            var query = new RegExp("(" + evt.target.value + ")", "gim");
            var matches = 0;

            for (var i = 0; i < this.props.root.length; i++) {
                let el = this.props.root[i];
                let e = el.innerHTML;

                let match = e.match(query);
                let nm = match ? match.length : 0;

                for (var j = 0; j < nm; j++) {
                   nodes.push(el);
                }

                matches += nm;

                let en = e.replace(/(<em>|<\/em>)/igm, "");
                let ne = en.replace(query, `<em>$1</em>`);
                this.props.root[i].innerHTML = ne;
            };

            this.setState({
                matchcount: matches,
                matchednodes: nodes
            });

            this.setState({ curmatch: 1 });
        }
    }

    render() {
        return (
            <div id="toolbar">
                <span id="search-control">
                    <input
                        id="search-input"
                        placeholder="Find"
                        autoFocus
                        onKeyUp={this.debounce(this.onKeyUp.bind(this), 50)}
                    />
                    <label id="search-matches" for="search-input">
                        {this.state.curmatch} of {this.state.matchcount}
                    </label>
                    <div className="search-nav-controls">
                        <div className="search-nav search-nav-prev" onClick={this.jumpPrev.bind(this)}></div>
                        <div className="search-nav search-nav-next" onClick={this.jumpNext.bind(this)}></div>
                    </div>
                </span>
            </div>
        );
    }
}
SearchBar.propTypes = {
    root: React.PropTypes.object
};

export default SearchBar;
