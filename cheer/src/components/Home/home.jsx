import React, { useState, useEffect } from 'react';
import './home.css';
import background from "./cheergroup.png"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const routerPath = `/api`; // Beginning of routerPath for login
const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`;

const Home = () => {
const [reviews, setReviews] = useState([]); 


  useEffect(() => {
    const fetchReviews = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/reviews`);
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      };
      
    fetchReviews();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <main>
        <div className="home-main-container">
          <div className="home-background-container">
            <div className="home-background-image-container">
              <img src={background} alt="Background"/>
            </div>
            <div className="home-content-container">
              <h2 className="home-subtitle">
                C.H.E.E.R Group
              </h2>
              <p className="home-main-paragraph">
                Social, recreation, leisure, and friendship program for young adults with intellectual disabilities.
              </p>
              <br />
              <br />
              <button className="home-login-overlay" onClick={handleLoginClick}>
                Login
              </button>
            </div>
            <div className="review-section">
                    {/* <ReviewForm fetchReviews={setReviews} />  */}
                    <div className="review-slideshow">
                        <h2>User Reviews</h2>
                        <Slider {...settings}>
                            {reviews && reviews.map((review) => (
                                <div key={review._id}>
                                    <p>{review.reviewText}</p>
                                    <p>- {review.username || 'Anonymous'}</p>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div> 
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2024 Ongoing Living & Learning Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;