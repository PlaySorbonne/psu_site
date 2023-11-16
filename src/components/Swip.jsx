import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MySwiper() {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      mousewheel={true}
      keyboard={true}
      modules={[Navigation, Mousewheel, Keyboard]}
      className="mySwiper"
      style={{ width: "100%" }}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
      <SwiperSlide>Slide 5</SwiperSlide>
    </Swiper>
  );
}
