"use strict";

var React = require('react');
var moment = require('moment');

var paymentActions = require('../actions.js');

var ModalTrigger = require('react-bootstrap').ModalTrigger;
var ModalPaymentDetails = require('./payment-detail.jsx');

var Payment = React.createClass({
  handleItemClick: function(id) {
    this.props.itemClickHandler(id);

    paymentActions.hidePaymentDetails();
  },

  handleButtonClick: function(id, e) {
    e.stopPropagation();

    this.props.buttonClickHandler(id);
  },

  render: function() {
    var doneButton, address;
    var classes = 'modal-container';
    var rippleGraphLink = 'http://www.ripplecharts.com/#/graph/' + this.props.model.get('transactionHash');

    if (this.props.model.get('new')) {
      classes += ' highlight';
    }

    if (this.props.model.get('direction') === 'from-ripple') {
      address = ['From', this.props.model.get('fromAddress').address];
    } else {
      address = ['To', this.props.model.get('toAddress').address];
    }


    //make a done button component and put this logic there!!
    if (this.props.model.get('state') === 'incoming') {
      doneButton = (
        <button
          onClick={this.handleButtonClick.bind(this, this.props.model.get('id'))}
          className="btn pull-right"
        >
          Done
        </button>
      );
    } else {
      doneButton = null;
    }

    return (
      <div className={classes}>
        <ModalTrigger modal={<ModalPaymentDetails model={this.props.model} container={this} />} container={this}>
          <li className="list-group-item" onClick={this.handleItemClick.bind(this, this.props.model.get('id'))}>
            <div className="row">
              <div className="col-sm-4">
                To Currency: {this.props.model.get('to_currency')} {this.props.model.get('to_amount')}
              </div>
              <div className="col-sm-1">
              </div>
              <div className="col-sm-4">
                From Currency: {this.props.model.get('from_currency')} {this.props.model.get('from_amount')}
              </div>
              <div className="col-sm-3">
                Status: {this.props.model.get('state')}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                Destination Tag: {this.props.model.get('toAddress').tag}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                {address[0]} Address: {address[1]}
              </div>
              <div className="col-sm-4">
                {doneButton}
              </div>
            </div>
            <div className="row border-bottom">
              <div className="col-sm-12">
                <a href={rippleGraphLink}>Ripple Graph Link</a>
              </div>
            </div>
            <div className="clearfix">
              <span className="pull-left">
                {moment(this.props.model.get('createdAt')).format('MMM D, YYYY HH:mm z')}
              </span>
            </div>
          </li>
        </ModalTrigger>
      </div>
    );
  }
});

module.exports = Payment;
