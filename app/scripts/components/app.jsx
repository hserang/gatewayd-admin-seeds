var React = require('react');
var TopBar = require('./header/top-bar.jsx');
var Footer = require('./footer/footer.jsx');
var Hellos = require('./hellos/hello.jsx');

var model = new (require('./../stores/hello-model'))();

require('react-bootstrap');

var App =
  React.createClass({

  render:function(){
    return (
      <div>
        <TopBar />
        <div className="container">
          <Hellos model={model} />
          <Footer />
        </div>
      </div>
    )
  }
});

module.exports = App;
