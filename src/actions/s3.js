import axios from 'axios';

// const ROOT_URL_DATABASE = 'https://jsanz-thesis-database.herokuapp.com/api';
const ROOT_URL_DATABASE = 'http://localhost:9090/api';
function getSignedRequest(file) {
  const fileParts = file.name.split('.');
  const fileName = encodeURIComponent(fileParts[0]);
  console.log('filename: ', fileName);
  console.log('file type: ', file.type);
  // hit our own server to get a signed s3 url
  return axios.get(`${ROOT_URL_DATABASE}/sign-s3?file-name=${fileName}&file-type=${file.type}`);
}

// return a promise that uploads file directly to S3
// note how we return the passed in url here rather than any return value
// since we already know what the url will be - just not that it has been uploaded
function uploadFileToS3(signedRequest, file, url) {
  return new Promise((fulfill, reject) => {
    console.log('file: ', file, 'signed request: ', signedRequest, 'url: ', url);
    axios.put(signedRequest, file, { headers: { 'Content-Type': file.type, ACL: 'public-read' } }).then((response) => {
      console.log('response from upload: ', response);
      fulfill(url);
    }).catch((error) => {
      console.log('error with upload: ', error);
      reject(error);
    });
  });
}

export default function uploadImage(file) {
  // returns a promise so you can handle error and completion in your component
  console.log('upload video: ', file);
  return getSignedRequest(file).then((response) => {
    console.log('get request: ', response);
    return uploadFileToS3(response.data.signedRequest, file, response.data.url);
  });
}
