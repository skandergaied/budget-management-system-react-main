// NewsCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import './News.css'; // Import the CSS file
import { Row, Col,Container } from 'react-bootstrap';
import SidebarNav from '../SidebarNav/SidebarNav';
import BreadcrumbAndProfile from '../BreadcrumbAndProfile/BreadcrumbAndProfile';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { color } from 'framer-motion';

function News({ topic, image, title, description }) { 

  const [newsData, setNewsData] = useState([]);
  async function getNewsData() {
   
    //Make news api call using axios
    const resp = await axios.get("https://newsapi.org/v2/everything?q=bitcoin&apiKey=b738ed2669c54125aae96fba7c1107d5&pageSize=9");
    setNewsData(resp.data.articles);
    
  }
  useEffect(() => {
    getNewsData();
    console.log(newsData);
  }, []);
  return (
    <Container fluid>
  <Row>
    <Col md={2} className="sidebar">
      <SidebarNav />
    </Col>
    
    <Col md={10} className="main-content main">
    <BreadcrumbAndProfile 
            
            role="Freelancer React Developer" 
            pageTitle="Dashboard"
            breadcrumbItems={[
              { name: 'Dashboard', path: '/dashboard', active: true },
              { name: 'News', path: '/welcome', active: true }
            ]}
          />
         {/* Section for news cards */}
         <div className="news-section">
            <h2 className="news-section-title">Latest News</h2>
            <div className="news-cards">
              {/* Custom content for each topic */}
              <Row>
  
    {newsData.map((news, index) => (
      <Col md={4} key={index} className="mt-4">
        <a target="_blank" href={news.url}>
          <Card>
            <Card.Title className="my-3" style={{ color: '#20215C',margin:"20px" }} >{news.title}</Card.Title>
            <Card.Img src={news.urlToImage} />
            <Card.Body>
              <Card.Text>
                {news.description}
              </Card.Text>
            </Card.Body>
          </Card>
        </a>
      </Col>
    ))}
  </Row>

            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
  
}

export default News;
