import { AnimatePresence, motion } from "framer-motion";
import { wrap } from "popmotion";
import React, { useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Menu = ({ images, position, setDisplay }) => {
  if (images) {
    const index = position;
    const [[page, direction], setPage] = useState([0, 0]);
    const imageIndex = wrap(0, images.length, page);

    const paginate = (newDirection) => {
      setPage([page + newDirection, newDirection]);
    };

    return (
      <div className="fixed left-0 top-0 z-20 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            className="z-30 h-[800px]"
            key={page}
            src={images[imageIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            //   exit="enter"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 1.2 },
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

        <div className="absolute z-40">
          <div className="flex w-[1200px] justify-between ">
            <div
              className="prev cursor-pointer text-5xl text-white"
              onClick={() => paginate(-1)}
            >
              <FaChevronCircleLeft />
            </div>
            <div
              className="next cursor-pointer text-5xl text-white"
              onClick={() => paginate(1)}
            >
              <FaChevronCircleRight />
            </div>
          </div>
        </div>

        <div className="absolute z-30 cursor-pointer pb-[85vh] pl-[70vw] text-5xl text-white">
          <CgCloseO
            onClick={() => {
              setDisplay(false);
            }}
          />
        </div>
      </div>
    );
  }
};

export default Menu;
