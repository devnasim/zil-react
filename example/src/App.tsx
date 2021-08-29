import React, { useState, useEffect } from 'react';
import { useZilReact,  } from '@zilliqa-react/core'
import {useEagerConnect, useInactiveListener} from './utils/hooks'
import { zilpay } from './utils/connectors';

function App() {
  const data= useZilReact();
console.log('zilpay.getNetworkId()', zilpay.getNetworkId(), (window as any).zilPay)
  return (
    <div className="App">
      <button onClick={()=> data.activate(zilpay)}>
       Connect
      </button>
    </div>
  );
}

export default App;
