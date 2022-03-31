/* eslint-disable jsx-a11y/media-has-caption */
import { useReactMediaRecorder } from 'react-media-recorder';
import React from 'react';
import * as faceapi from 'face-api.js';
import { sendVideo } from '../actions/index';

const RecordView = () => {
  // const [file, setFile] = useState(null);
  const stopped = async (url, blob) => {
    const myFile = new File(
      [blob],
      'name.mp4',
      { type: 'video/mp4' },
    );
    // setFile(myFile);
    console.log(myFile);
    const detections = await faceapi.detectAllFaces('thevid', new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    console.log(detections, 'detections');
    sendVideo(url);
  };
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ video: true, onStop: stopped, blobPropertyBag: { type: 'video/mp4' } });
  console.log({ mediaBlobUrl });

  return (
    <div>
      <p>{status}</p>
      <button type="button" onClick={startRecording}>Start Recording</button>
      <button type="button" onClick={stopRecording}>Stop Recording</button>
      <video src={mediaBlobUrl} type="video/mp4" id="thevid" controls autoPlay loop muted />
    </div>
  );
};

export default RecordView;
