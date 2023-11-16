import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";

import "swiper/css";

export default function MySwiper() {
  return (
    <Swiper
      cssMode={true}
      navigation={true}
      modules={[Navigation]}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 1</SwiperSlide>
    </Swiper>
  );
}
