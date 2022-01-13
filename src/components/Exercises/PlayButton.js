/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

class PlayButton extends Component {
  render() {
    return (
      <div className="play-background" type="button" onClick={this.props.playMusic}>
        <FontAwesomeIcon icon={faPlay} id="play-intervals-button" />
      </div>
    );
  }
}

export default PlayButton;
