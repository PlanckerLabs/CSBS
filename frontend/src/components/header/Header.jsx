import React, { useEffect } from 'react';
import hoverEffect from 'hover-effect';

import './header.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
// import seller1 from '../../assets/seller1.jpg'
// import seller2 from '../../assets/seller2.png'
// import seller3 from '../../assets/seller3.png'
// import seller4 from '../../assets/seller4.png'
// import seller5 from '../../assets/seller5.png'
// import seller6 from '../../assets/seller6.jpg'
import bids1 from '../../assets/bids1.png'
import bids2 from '../../assets/bids2.png'
import bids3 from '../../assets/bids3.png'
import bids4 from '../../assets/bids4.png'
import bids5 from '../../assets/bids5.png'
import bids6 from '../../assets/bids6.png'

import verify from '../../assets/verify.png'
import a1 from '../../assets/1.jpeg'
import a2 from '../../assets/2.jpeg'
import { Link  } from 'react-router-dom';

const Header = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide:true,
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        }
      }
    ]
  };
  useEffect(() => {
    let image_animate = new hoverEffect({
      parent: document.querySelector('.item_image1'),
      intensity: 0.3,
      image1: a1,
      image2: a2,
      displacementImage: a2,
    });
  });

  return (
    <div className='header section__padding'>
      <div className="header-content">
        <div>
        {/* <h1>Dali Web3 Conference</h1> */}
          <h1>Build together, Record forever!</h1>
          <div className="item_image1"></div>
          {/* <img className='shake-vertical' src={coin} alt="" /> */}
        </div>
      </div>
      <div className="header-slider">
        <h1> Event  list</h1>
       <Slider {...settings} className='slider'>
            <div className='slider-card'>
              <div className="flex justify-center">
                <img width='50%' height='50%' src={bids1} alt="" />
              </div>
              <Link to={`/eventProfile/Rian`}>
              <p className='slider-card-name'>ETH DevCon London</p>
              </Link>
              <p className='slider-card-price'>2022-9-10 <span>London</span></p>
            </div>
            <div className='slider-card'>
              <div className="flex justify-center">
                <img width='50%' height='50%' src={bids2} alt="" />
              </div>
              <Link to={`/eventProfile/Rian`}>
              <p className='slider-card-name'>ETH DevCon London</p>
              </Link>
              <p className='slider-card-price'>2022-9-10 <span>London</span></p>
            </div>
            <div className='slider-card'>
              <div className="flex justify-center">
                <img width='50%' height='50%' src={bids3} alt="" />
              </div>
              <Link to={`/eventProfile/Rian`}>
              <p className='slider-card-name'>ETH DevCon London</p>
              </Link>
              <p className='slider-card-price'>2022-9-10 <span>London</span></p>
            </div>
            <div className='slider-card'>
              <div className="flex justify-center">
                <img width='50%' height='50%' src={bids4} alt="" />
              </div>
              <Link to={`/eventProfile/Rian`}>
              <p className='slider-card-name'>ETH DevCon London</p>
              </Link>
              <p className='slider-card-price'>2022-9-10 <span>London</span></p>
            </div>
            <div className='slider-card'>
              <div className="flex justify-center">
                <img width='50%' height='50%' src={bids5} alt="" />
              </div>
              <Link to={`/eventProfile/Rian`}>
              <p className='slider-card-name'>ETH DevCon London</p>
              </Link>
              <p className='slider-card-price'>2022-9-10 <span>London</span></p>
            </div>
            <div className='slider-card'>
              <div className="flex justify-center">
                <img width='50%' height='50%' src={bids6} alt="" />
              </div>
              <Link to={`/eventProfile/Rian`}>
              <p className='slider-card-name'>ETH DevCon London</p>
              </Link>
              <p className='slider-card-price'>2022-9-10 <span>London</span></p>
            </div>
        </Slider>
      </div>
      <div className="load-more">
        <button>Load More</button>
      </div>
    </div>
  )
}

export default Header
