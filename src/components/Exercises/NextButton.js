/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

class NextButton extends Component {
  render() {
    return (
      <div className="next-button-holder">
        <button className="next-button" type="button" onClick={this.props.goToNext}> Next </button>
      </div>
    );
  }
}

export default NextButton;
