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
  console.log(props.slides);
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

const carrouselStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const slideStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const contentStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(0deg, rgba(59,59,108,1) 5%, rgba(0,212,255,0) 100%)",
};

const textWrapperStyle: React.CSSProperties = {
  maxWidth: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "3rem",
  fontWeight: "900",
  textTransform: "uppercase",
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "200",
  textTransform: "uppercase",
  textAlign: "center",
};