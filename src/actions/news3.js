import axios from 'axios';

const ROOT_URL_DATABASE = 'http://localhost:9090/api';

const uploadS3 = (file) => {
  console.log('filename: ', file.name);
  const fileParts = file.name.split('.');
  axios.post(`${ROOT_URL_DATABASE}/signs3`, {
    fileName: fileParts[0],
    fileType: fileParts[1],
  })
    .then((response) => {
      const { returnData } = response.data.data;
      const { signedRequest } = returnData;
      const { url } = returnData;
      this.setState({ url });
      console.log(`Recieved a signed request ${signedRequest}`);

      // Put the fileType in the headers for the upload
      const options = {
        headers: {
          'Content-Type': file.type,
        },
      };
      axios.put(signedRequest, file, options)
        .then((result) => {
          console.log('Response from s3');
          this.setState({ success: true });
        })
        .catch((error) => {
          alert(`ERROR ${JSON.stringify(error)}`);
        });
    })
    .catch((error) => {
      alert(JSON.stringify(error));
    });
};

export default uploadS3;
