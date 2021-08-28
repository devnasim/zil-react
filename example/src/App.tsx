import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [zil, setZil] = useState<any>(null);

  useEffect(() => { 
    if((window as any).zilPay) {
      setZil((window as any).zilPay);
    }
  }, []);

  console.log('zil', zil)

  zil && zil.wallet.observableNetwork().subscribe((network:any) => {
    console.log('network', network)
  })

  zil && zil.wallet.observableAccount().subscribe((account:any) => {
    console.log('account', account)
  })

  const data= zil && zil.wallet.get
  console.log('data', data)
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          target="_blank"
          rel="noopener noreferrer"
          onClick={()=>zil.wallet.connect()}
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
