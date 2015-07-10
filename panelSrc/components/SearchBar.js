import React from 'react';

class SearchBar extends React.Component {
  onKeyUp() {
    console.log(document.getElementById('search-input').value);
  }

  render() {
      console.log(this.props.root);
      return (
          <div id="toolbar">
              <span id="search-control">
                  <input id="search-input" placeholder="Find" onKeyUp={this.onKeyUp.bind(this)} />
                  <label id="search-matches" for="search-input">1 of 89</label>
                  <div className="search-nav-controls">
                      <div className="search-nav search-nav-next"></div>
                      <div className="search-nav search-nav-prev"></div>
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
