import React from 'react';

const Start = () => {
  return (
    <div>
      <button type="button"
        onClick={() => {
          window.open('https://jsanz-thesis.surge.sh/lessons/random', 'Lesson', 'popup,width=1440,height=900');
        }}
      >Click to open new window to start
      </button>
    </div>
  );
};
export default Start;
