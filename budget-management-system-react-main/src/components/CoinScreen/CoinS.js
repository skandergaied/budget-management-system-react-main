/*
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

      {filteredCoins.map(coin => {
        return (
          <Coin
            key={coin.id}
            name={coin.name}
            price={coin.current_price}
            symbol={coin.symbol}
            marketcap={coin.total_volume}
            volume={coin.market_cap}
            image={coin.image}
            priceChange={coin.price_change_percentage_24h}
          />
        );
      })}
    </div>
  );
}

export default CoinS;

 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoinS.css';
import Coin from '../Coin/Coin';

function CoinS() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [usdToTry, setUsdToTry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tüm verileri çekme fonksiyonu
  const fetchData = async () => {
    try {
      const [cryptoResponse, forexResponse] = await Promise.all([


        axios.get(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana&sparkline=true'
        ),

         axios.get('https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_rG8RHojGKwfPCxlD7OtBCInzTzyVVCqyyNr67Zv6&currencies=TRY')
      ]);



      setCoins(cryptoResponse.data);
      setUsdToTry(forexResponse.data.data.TRY);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Arama fonksiyonu
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter(coin =>
      coin.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Veriler yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  return (
      <div className='coin-app'>
        <input
            type="text"
            placeholder="Kripto ara..."
            className="coin-search"
            onChange={handleSearch}
        />

        <div className="coin-container">
          {filteredCoins.map(coin => (
              <Coin
                  key={coin.id}
                  name={coin.name}
                  price={coin.current_price}
                  symbol={coin.symbol}
                  marketcap={coin.market_cap}
                  volume={coin.total_volume}
                  image={coin.image}
                  priceChange={coin.price_change_percentage_24h}
                  usdToTry={usdToTry}
              />
          ))}
        </div>
      </div>
  );
}

export default CoinS;