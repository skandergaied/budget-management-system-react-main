// src/components/PredictionCard/PredictionCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp, faArrowTrendDown, faEquals } from '@fortawesome/free-solid-svg-icons';
import './PredictionCard.css'; // We'll create this CSS file

const PredictionCard = ({ itemName, latestPrice, predictedPrice, changePercentage }) => {
  const isPositive = changePercentage > 0;
  const isNegative = changePercentage < 0;
  const trendIcon = isPositive ? faArrowTrendUp : isNegative ? faArrowTrendDown : faEquals;
  const trendColor = isPositive ? 'positive-trend' : isNegative ? 'negative-trend' : 'neutral-trend';
  const formattedLatestPrice = latestPrice !== undefined ? latestPrice.toFixed(2) : 'N/A';
  const formattedPredictedPrice = predictedPrice !== undefined ? predictedPrice.toFixed(2) : 'N/A';
  const formattedChangePercentage = changePercentage !== undefined ? changePercentage.toFixed(2) : 'N/A';


  return (
    <Card className={`prediction-card h-100 ${trendColor}`}>
      <Card.Body>
        <Card.Title className="prediction-card-title">
          {itemName}
          <FontAwesomeIcon icon={trendIcon} className={`trend-icon ms-2`} />
        </Card.Title>
        <div className="price-info">
          <div className="price-current">
            <span className="price-label">Current:</span>
            <span className="price-value">${formattedLatestPrice}</span>
          </div>
          <div className="price-predicted">
            <span className="price-label">Predicted:</span>
            <span className="price-value">${formattedPredictedPrice}</span>
          </div>
        </div>
        <div className="change-info">
          <span className="change-label">Change:</span>
          <span className={`change-value ${trendColor}`}>
            {formattedChangePercentage}%
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PredictionCard;