import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import type { EventT } from "@/helpers";

import styles from "./Carrousel.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Carrousel(props: { slides: EventT[] }) {
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
      simulateTouch={false}
      className={styles.carrousel}
    >
      {props.slides.map((slide, index) => (
        <SwiperSlide
          key={index}
          className={styles.slide}
          style={{ backgroundImage: `url(${slide.cover})` }}
        >
          <div className={styles.content}>
            <a
              className={`${styles.textWrapper} ${
                slide.noLink || !slide.link ? "" : styles.animate
              }`}
              href={slide.noLink ? undefined : slide.link}
            >
              <h1 className={styles.title}>{slide.title}</h1>
              <h2 className={styles.subtitle}>{slide.subtitle}</h2>
            </a>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
