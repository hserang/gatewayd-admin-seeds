var React = require('react');

var Branding = React.createClass({
  propTypes: {
    brandName: React.PropTypes.string
  },

  render: function() {
    return (
      <a className="navbar-brand">
        {this.props.brandName}
      </a>
    );
  }
});

module.exports = Branding;
