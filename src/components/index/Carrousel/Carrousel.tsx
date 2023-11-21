import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import styles from "./Carrousel.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface carrouselT {
  title: string;
  subtitle?: string;
  src: string;
  alt: string;
}

export default function Carrousel(props: { slides: carrouselT[] }) {
  return (
    <Swiper
      loop={true}
      navigation={true}
      pagination={true}
      modules={[Navigation, Pagination, Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      className={styles.carrousel}
    >
      {props.slides.map((slide, index) => (
        <SwiperSlide
          key={index}
          className={styles.slide}
          style={{ backgroundImage: `url(${slide.src})` }}
        >
          <div className={styles.content}>
            <div className={styles.textWrapper}>
              <h1 className={styles.title}>{slide.title}</h1>
              <h2 className={styles.subtitle}>{slide.subtitle}</h2>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}