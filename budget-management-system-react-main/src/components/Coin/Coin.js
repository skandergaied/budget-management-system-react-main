import React from 'react';
import './Coin.css';

const Coin = ({ name, price, symbol, market_cap, total_volume, image, price_change_percentage_24h, usdToTry }) => {
  const priceChange = price_change_percentage_24h;
  const priceInTry = price && usdToTry ? price * usdToTry : 0; // Protect if undefined

  return (
    <div style={{
      backgroundColor: '#002366',
      borderRadius: '8px',
      padding: '10px',
      width: '60%',
      margin: '2px',
      height: '100%',
    
      textAlign: 'center',
        
      color: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
    }}>
      <img src={image} alt={name} style={{ width: '40px', height: '40px', marginBottom: '5px' }} />
      <h5 style={{ fontSize: '0.9rem', marginBottom: '3px' }}>{name} ({symbol?.toUpperCase()})</h5>
  
      <p style={{ margin: '3px 0', fontSize: '0.8rem' }}>
        Price (USD): <strong>${price ? price.toLocaleString() : 'N/A'}</strong>
      </p>
      <p style={{ margin: '3px 0', fontSize: '0.8rem' }}>
        Price (₺): <strong>{priceInTry ? priceInTry.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'}₺</strong>
      </p>
    </div>
  );
};



export default Coin;