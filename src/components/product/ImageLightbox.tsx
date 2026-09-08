import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useSwipe } from "../../hooks/useSwipe";
import { CloseIcon, ChevronRightIcon } from "../common/icons";
import "./ImageLightbox.css";

interface ImageLightboxProps {
  images: string[];
  activeIndex: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export function ImageLightbox({ images, activeIndex, onNavigate, onClose }: ImageLightboxProps) {
  useBodyScrollLock(true);

  const hasMultiple = images.length > 1;

  const goPrev = () => onNavigate((activeIndex - 1 + images.length) % images.length);
  const goNext = () => onNavigate((activeIndex + 1) % images.length);

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  return (
    <div className="image-lightbox" onClick={onClose} {...swipeHandlers}>
      <button className="image-lightbox__close" aria-label="Cerrar" onClick={onClose}>
        <CloseIcon />
      </button>

      {hasMultiple && (
        <button
          className="image-lightbox__nav image-lightbox__nav--prev"
          aria-label="Imagen anterior"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
        >
          <ChevronRightIcon />
        </button>
      )}

      <img
        src={images[activeIndex]}
        alt=""
        className="image-lightbox__image"
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          className="image-lightbox__nav image-lightbox__nav--next"
          aria-label="Imagen siguiente"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
        >
          <ChevronRightIcon />
        </button>
      )}

      {hasMultiple && (
        <div className="image-lightbox__count">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
