import React from 'react';
// Removed './Coin.css'; assuming styles are in CoinS.css as per your setup

// Helper function to handle image loading errors
const ImageWithFallback = ({ src, alt, fallbackSrc = "https://via.placeholder.com/40?text=N/A", className }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const onError = () => setImgSrc(fallbackSrc);
  return <img src={imgSrc || fallbackSrc} alt={alt} className={className} onError={onError} />;
};

function Coin({ name, price, symbol, image, priceChange }) {
  const priceChangeColor = priceChange >= 0 ? 'positive-change' : 'negative-change';

  // Handle cases where price might be null or undefined
  const formattedPrice = price !== null && typeof price !== 'undefined'
    ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'N/A';

  return (
    <div className="coin-item">
      <ImageWithFallback src={image} alt={`${name} logo`} className="coin-image" />
      <div className="coin-content-wrapper">
        <div className="coin-info-main">
          <span className="coin-symbol">{symbol.toUpperCase()}</span>
          <span className="coin-name">{name}</span>
        </div>
        <div className="coin-market-details">
          <span className="coin-price">${formattedPrice}</span>
          {typeof priceChange === 'number' && (
            <span className={`coin-price-change ${priceChangeColor}`}>
              {priceChange.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Coin;