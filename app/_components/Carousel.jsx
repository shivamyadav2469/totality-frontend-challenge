"use client"

import React, { useState, useEffect } from 'react';

function Carousel() {
  const images = [
    'https://imageio.forbes.com/specials-images/imageserve/637cf497fd2163c10d588249/Exterior-view-of-the-homes-pool-and-terrace-looking-out-over-the-trees-/960x0.jpg?format=jpg&width=960',
    'https://media.architecturaldigest.com/photos/57e42de0fe422b3e29b7e78f/16:9/w_2560%2Cc_limit/JW_LosCabos_2015_MainExterior.jpg',
    'https://www.litorehotel.com/web/en/images/placeholders/1920x1200-0.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 3000); // change image every 3 seconds

    return () => clearInterval(intervalId);
  }, [currentIndex, images.length]);

  return (
    <div className='carousel-container'>
      <div className="carousel">
        <img src={images[currentIndex]} alt="Carousel Image" />
      </div>
      <div className="overlay">
        <h1>Discover your dream rental</h1>
        <p>with Homely Hub</p>
      </div>
    </div>
  );
}

export default Carousel;
