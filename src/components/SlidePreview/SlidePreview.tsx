import { useEffect } from 'react';
import styles from './SlidePreview.module.css';
import React from 'react';

interface props extends React.HTMLAttributes<HTMLDivElement> {
  slides: number
  width?: number
  height?: number
  preview?: string | null
}

export default function SlidePreview({slides = 0, width = 90, height = 60, preview}: props) {
  const slideContainer = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const slideElements = slideContainer.current?.querySelectorAll(`.${styles.slidePreview__slide}`)!
    slideElements.forEach((slide, i) => {
      if(i < slides) {
        slide.classList.remove(styles.slidePreview__slide_preState)
      } else {
        slide.classList.add(styles.slidePreview__slide_preState)
      }
    })
  }, [slides])

  return <div className={`${styles.slidePreview}`} ref={slideContainer} style={{"--slide-ratio": width / height}}>
    <div className={`${styles.slidePreview__noSlides} ${slides > 0 ? styles.hidden : ''}`}>Nothing selected</div>
    <div className={`${styles.slidePreview__slides} ${slides === 0 && `${styles.hidden}`}`}>
      {[...Array(8).keys()].map((index) => <div key={index} className={`${styles.slidePreview__slide} ${styles.slidePreview__slide_preState}`}>
        {(preview && index === 0) && <img src={preview} alt="first slide preview" />}
      </div>)}
    </div>
  </div>;
}