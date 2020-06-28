// In App.js in a new project

import * as React from 'react';
import Routes from "./src/routes"
import { StatusBar } from 'react-native';

function App() {
  return (
    <>

<StatusBar barStyle="light-content" backgroundColor="#7d40e7" />
    <Routes />
    </>
  );
}

export default App;