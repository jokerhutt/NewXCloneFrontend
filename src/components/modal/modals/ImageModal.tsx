import { useState } from "react";
import { useModal } from "../../../context/GlobalState/ModalProvider.tsx";
import type { ModalType } from "../../../lib/types/ModalType.ts";
import { MediaImage } from "../../layout/media/MediaImage.tsx";
import { HeroIcon } from "../../ui/HeroIcon.tsx";
import { AnimatePresence, motion } from "framer-motion";

type ImageModalProps = {
    setToggle: (modalType: ModalType) => void;
    mediaId: number;
    mediaList: number[]
  };
  
  function ImageModal({ setToggle, mediaId, mediaList }: ImageModalProps) {

    const [currentIndex, setCurrentIndex] = useState(mediaList.indexOf(mediaId));

    return (
      <div className="rounded-xl relative flex justify-center items-center w-full h-full">

        {currentIndex > 0 && (
        <div onClick={() => setCurrentIndex((prev) => prev - 1)} className="absolute h-12 w-12 rounded-full hover:cursor-pointer hover:bg-twitterText/30 left-4 flex justify-center items-center">
          <HeroIcon iconName="ArrowLeftIcon" className="w-6 h-6 text-white"/>
        </div>
        )}

        <div className="flex justify-center items-center py-2 px-4">
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mediaList[currentIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
    <MediaImage id={mediaList[currentIndex]} roundedClass="rounded-2xl" isModal={true}/>
  </motion.div>
</AnimatePresence>
        </div>

        {currentIndex < mediaList.length - 1 && (
        <div onClick={() => setCurrentIndex((prev) => prev + 1)} className="absolute h-12 w-12 rounded-full hover:cursor-pointer hover:bg-twitterText/30 right-4 flex justify-center items-center">
          <HeroIcon iconName="ArrowRightIcon" className="w-6 h-6 text-white"/>
        </div>
        )}
          
        </div>

    );
  }
  
  export default ImageModal;