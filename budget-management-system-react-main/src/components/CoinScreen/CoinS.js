import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoinS.css';
import Coin from '../Coin/Coin';


function CoinS() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
      )
      .then(res => {
        setCoins(res.data);
        console.log(res.data);
      })
      .catch(error => console.log(error));
  }, []);

 

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='coin-app' style={{ padding: '0px', borderRadius: '10px',height: '100vh',width: '100%', display: 'flex'  }}>
      
      {filteredCoins.slice(0, 6).map(coin => {
        return (
          <Coin  
            key={coin.id}
            name={coin.name}
            price={coin.current_price}
            symbol={coin.symbol}
            image={coin.image}     
          />
        );
      })}
    </div>
  );
}

export default CoinS;