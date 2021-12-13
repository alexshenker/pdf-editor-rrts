import React from 'react';

//components
import Toolbar from './toolbar/Toolbar';
import Dropzone from './dropzone/Dropzone';
import Viewer from './viewer/Viewer';


function App() {
  return (
    <div>
      <Dropzone />
      <Toolbar />
      <Viewer />
    </div>
  );
}

export default App;
