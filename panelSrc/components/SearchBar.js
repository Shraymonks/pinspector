import React from 'react';

class SearchBar extends React.Component {
    constructor() {
        super();
        this.state = {
            curmatch: 0,
            matchcount: 0,
            matchednodes: [],
            searchText: ''
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

    onKeyUp({keyCode, target, which}) {
        var nodes = this.state.matchednodes;
        var charCode = (typeof which === "number") ? which : keyCode;
        if (charCode === 13) { // enter key
            this.jumpNext();
        } else {
            nodes = [];
        }

        if (target.value === this.state.searchText) {
            return;
        }

        this.setState({searchText: target.value});

        if (target.value === '') {
            this.setState({
                matchcount: 0,
                curmatch: 0,
                matchednodes: []
            });
            Array.from(this.props.root).forEach((element) => {
                element.innerHTML = element.innerHTML.replace(/(<em>|<\/em>)/igm, "");
            });
        } else if (nodes.length <= 0) {
            var query = new RegExp("(" + target.value + ")", "gim");
            var matches = 0;

            for (var i = 0; i < this.props.root.length; i++) {
                let el = this.props.root[i];
                let e = el.innerHTML.replace(/(<em>|<\/em>)/igm, "");

                let match = e.match(query);
                let nm = match ? match.length : 0;

                for (var j = 0; j < nm; j++) {
                   nodes.push(el);
                }

                matches += nm;

                let ne = e.replace(query, `<em>$1</em>`);
                this.props.root[i].innerHTML = ne;
            };

            nodes[0].scrollIntoView();

            this.setState({
                curmatch: 1,
                matchcount: matches,
                matchednodes: nodes
            });
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
                        <div className="search-nav search-nav-prev" onClick={this.jumpPrev.bind(this)}>▲</div>
                        <div className="search-nav search-nav-next" onClick={this.jumpNext.bind(this)}>▼</div>
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
