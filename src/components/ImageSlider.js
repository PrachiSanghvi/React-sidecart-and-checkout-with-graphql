import React, { Component } from "react";
import Slider from "react-slick";

const ImageSlider = ({images}) => {
 
    const settings = {
      customPaging: function(i) {
        return (
          <div>
            <img src={images[i]?.node?.image?.src} width="100" />
          </div>
        );},
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows:true.valueOf,
      dotsClass: "slick-dots slick-thumb",
    };

    return (
      <div style={{width:'600px',marginLeft:'5%'}}>
        <Slider {...settings}>
          {images?.map((ele,i)=>(
            <div key={i}>
              <img src={ele?.node?.image?.src} id={i} width={"100%"}/>
            </div>
          ))}
        </Slider>
      </div>
    );

}

export default ImageSlider;