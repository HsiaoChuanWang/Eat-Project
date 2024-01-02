import { AnimatePresence, motion } from "framer-motion";
import { wrap } from "popmotion";
import React, { useEffect, useState } from "react";
import banner01 from "./homepagePictures/banner01.jpg";
import banner02 from "./homepagePictures/banner02.jpg";
import banner03 from "./homepagePictures/banner03.jpg";

const variants = {
  enter: () => {
    return {
      x: 0,
      opacity: 0.5,
    };
  },
  center: {
    zIndex: 0,
    x: 0,
    opacity: 1,
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Carousel = () => {
  const banners = [banner01, banner02, banner03];
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = wrap(0, banners.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const apple = window.setInterval(() => {
      paginate(1);
    }, 4000);

    return () => {
      clearInterval(apple);
    };
  }, [page]);

  return (
    <div className="relative flex w-full items-center justify-center bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          className="h-[400px] w-full object-cover object-center"
          key={page}
          src={banners[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          transition={{
            ease: "linear",
            duration: 0.5,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
