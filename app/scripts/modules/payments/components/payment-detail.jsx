'use strict';

var React = require('react');
var _ = require('lodash');
var moment = require('moment');

var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

var PaymentDetail = React.createClass({
  hidePaymentDetails: function() {
    this.props.onRequestHide();
  },

  render: function() {
    return (
      <Modal
        title="Payment Details"
        backdrop={true}
        onRequestHide={this.hidePaymentDetails}
        animation={false}
      >
        <div className="modal-body">
          <div className="row border-bottom">
            {moment(this.props.model.get('updatedAt')).format('MMM D, YYYY HH:mm z')}
          </div>
          <br />
          <div className="row">
            Transaction Id: {this.props.model.get('id')}
          </div>
          <br />
          <div className="row">
          </div>
          <div className="row">
            <div className="col-sm-5 border-bottom">
              <div className="row">
                <div className="col-sm-3">
                  Source:
                </div>
                <div className="col-sm-9">
                  {this.props.model.get('fromAddress').address}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  Tag:
                </div>
                <div className="col-sm-9">
                  {this.props.model.get('fromAddress').tag || 'none'}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  Balance Changes:
                </div>
              </div>
              <div className="row">
                <div className="col-sm-9 col-sm-offset-3">
                  - {this.props.model.get('from_amount')} {this.props.model.get('from_currency')}
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-sm-offset-1 border-bottom">
              <div className="row">
                <div className="col-sm-3">
                  Destination:
                </div>
                <div className="col-sm-9">
                  {this.props.model.get('toAddress').address}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  Tag:
                </div>
                <div className="col-sm-9">
                  {this.props.model.get('toAddress').tag || 'none'}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  Balance Changes:
                </div>
              </div>
              <div className="row">
                <div className="col-sm-9 col-sm-offset-3">
                  + {this.props.model.get('to_amount')} {this.props.model.get('to_currency')}
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="row">
            Invoice Id: {this.props.model.get('invoice_id') || 'none'}
          </div>
          <br />
          <div className="row">
            Transaction Hash: {this.props.model.get('transaction_hash') || 'none'}
          </div>
          <br />
          <div className="row">
            Memo: {'Memo goes here' || 'none'}
          </div>
        </div>
        <div className="modal-footer">
          <Button bsStyle="primary" onClick={this.hidePaymentDetails} block>
            Close
          </Button>
        </div>
      </Modal>
    );
  }
});

module.exports = PaymentDetail;
