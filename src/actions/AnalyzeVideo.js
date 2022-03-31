/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import * as faceapi from 'face-api.js';

export const getVideoElementVersion = (vid) => {
  return <video src={vid} id="video-to-analyze" />;
};

export const analyzeVid = async (vid) => {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  console.log('analyzing...');
  const faces = await faceapi.detectSingleFace(vid);
  console.log(faces);
};
