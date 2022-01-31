/* eslint-disable jsx-a11y/media-has-caption */
import { useReactMediaRecorder } from 'react-media-recorder';
import React, { useState } from 'react';
import { sendVideo } from '../actions/index';

const RecordView = () => {
  const [file, setFile] = useState(null);
  const stopped = (url, blob) => {
    console.log(blob);
    const myFile = new File(
      [blob],
      'name.mp4',
      { type: 'video/mp4' },
    );
    setFile(myFile);
    console.log(myFile);
    sendVideo(myFile);
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
      {file ? <video src={file} type="video/mp4" controls autoPlay loop /> : <div />}
    </div>
  );
};

export default RecordView;
