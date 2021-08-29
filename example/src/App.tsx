import React, { useState, useEffect } from 'react';
import { useZilReact } from '@zilliqa-react/core'
import {useEagerConnect, useInactiveListener} from './utils/hooks'
import { zilpay } from './utils/connectors';

function App() {
  const data= useZilReact();
  const triedEager = useEagerConnect()
  // handle logic to connect in reaction to certain events on the injected zilpay provider, if it exists
  useInactiveListener(!triedEager)
console.log('data', data)
  return (
    <div className="App">
      <button onClick={()=> data.activate(zilpay)}>
       Connect
      </button>
    </div>
  );
}

export default App;
