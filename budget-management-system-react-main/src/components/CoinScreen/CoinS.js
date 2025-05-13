import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoinS.css'; // Ensure this path is correct
import Coin from '../Coin/Coin'; // Ensure this path is correct

function CoinS() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=14&page=1&sparkline=false')
      .then(res => {
        // console.log("CoinGecko API Response:", res);

        if (res && Array.isArray(res.data)) {
          const formattedCoins = res.data.map(asset => {
            const id = asset.id;
            const name = asset.name || 'Unknown';
            const current_price = parseFloat(asset.current_price);
            const symbol = asset.symbol || 'N/A';
            const image_url = asset.image;
            const price_change_percentage_24h = parseFloat(asset.price_change_percentage_24h);

            return {
              id: id,
              name: name,
              price: !isNaN(current_price) ? current_price : null, // Use null for N/A price
              symbol: symbol,
              image: image_url,
              priceChange: !isNaN(price_change_percentage_24h) ? price_change_percentage_24h : 0,
            };
          });
          setCoins(formattedCoins);
        } else {
          console.error("Unexpected API response structure from CoinGecko:", res.data);
          setError('Failed to parse crypto data. Expected an array from API.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching crypto data from CoinGecko:", err);
        if (err.response) {
          console.error("API Error Response Data:", err.response.data);
          console.error("API Error Response Status:", err.response.status);
          let errorMessage = 'Could not fetch data.';
          if (err.response.data && err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (typeof err.response.data === 'string' && err.response.data.trim() !== '') {
            errorMessage = err.response.data;
          } else if (err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          }
          setError(`API Error: ${err.response.status} - ${errorMessage}`);
        } else if (err.request) {
          console.error("API No Response:", err.request);
          setError('Network error or no response from crypto API.');
        } else {
          console.error("API Request Setup Error:", err.message);
          setError('Error setting up request to crypto API.');
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="coins-container coins-loading">Loading Crypto Data...</div>;
  }

  if (error) {
    return <div className="coins-container coins-error">Error: {error}</div>;
  }

  if (coins.length === 0) {
    return <div className="coins-container coins-empty">No crypto data available.</div>;
  }

  return (
    <div className="coins-container">
      <h3 className="coins-header">Crypto Watchlist</h3>
      <div className="coins-list">
        {coins.slice(0, 6).map(coin => (
          <Coin
            key={coin.id}
            name={coin.name}
            price={coin.price}
            symbol={coin.symbol}
            image={coin.image}
            priceChange={coin.priceChange}
          />
        ))}
      </div>
    </div>
  );
}

export default CoinS;