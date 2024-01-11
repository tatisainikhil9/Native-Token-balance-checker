import React from 'react';
import NetworkDataRow from './NetworkDataDisplay';
import './App.css';

const App = () => {
  const networks = [
    { name: 'Mantle', rpcUrl: 'https://rpc.mantle.xyz', address: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7' },
    { name: 'Linea', rpcUrl: 'https://1rpc.io/linea', address: '0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7' },
    { name: 'Kroma', rpcUrl: 'https://api.kroma.network', address: '0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859' },
  ];

  return (
    <div className="app-container">
      <h1 className="app-title">Native Token Balance Checker</h1>
      <div className="network-dashboard">
          {networks.map(network => (
              <div key={network.name} className={`network-column ${network.name.toLowerCase()}`}>
                  <NetworkDataRow
                      rpcUrl={network.rpcUrl}
                      networkName={network.name}
                      address={network.address}
                      refreshInterval={12 * 60 * 60 * 1000} // 12 hours
                  />
              </div>
          ))}
      </div>
    </div>
  );
};

export default App;
