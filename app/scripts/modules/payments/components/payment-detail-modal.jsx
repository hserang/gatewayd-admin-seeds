"use strict";

var _ = require('lodash');

var React = require('react');

var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var paymentActions = require('../actions.js');

var PaymentDetailContent = require('./payment-detail-content.jsx');

var PaymentDetail = React.createClass({
  propTypes: {
    model: React.PropTypes.object,
    onRequestHide: React.PropTypes.func
  },

  hidePaymentDetails: function() {
    this.props.onRequestHide();
  },

  handleProcessButtonClick: function() {
    paymentActions.flagAsDone(this.props.model.get('id'));
  },

  render: function() {
    return (
      <Modal
        title="Payment Details"
        onRequestHide={this.hidePaymentDetails}
        animation={false}
      >
        <div className="modal-body">
          <PaymentDetailContent model={this.props.model} />
        </div>
        <div className="modal-footer">
          <div className="row">
            <div className="col-sm-7 col-sm-offset-2">
              <h4>
                Are you sure you want to process this payment?
              </h4>
            </div>
            <div className="col-sm-3">
              <ButtonToolbar>
                <Button
                  bsStyle="success"
                  bsSize="large"
                  onClick={this.handleProcessButtonClick}
                >
                  <span className="glyphicon glyphicon-ok" />
                </Button>
                <Button
                  bsStyle="danger"
                  bsSize="large"
                  onClick={this.hidePaymentDetails}
                >
                  <span className="glyphicon glyphicon-remove" />
                </Button>
              </ButtonToolbar>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
});

module.exports = PaymentDetail;
