import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { CldImage } from 'next-cloudinary'
import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { variants } from '../utils/animationVariants'
import downloadPhoto from '../utils/downloadPhoto'
import { range } from '../utils/range'
import type { ImageProps, SharedModalProps } from '../utils/types'
import Twitter from './Icons/Twitter'

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction
}: SharedModalProps) {
  const [loaded, setLoaded] = useState(false)

  let filteredImages = images?.filter((img: ImageProps) =>
    range(index - 15, index + 15).includes(img.id)
  )

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1)
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1)
      }
    },
    trackMouse: true
  })

  let currentImage = images ? images[index] : currentPhoto

  return (
    <MotionConfig
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <div
        className="relative z-50 flex w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
        style={{ aspectRatio: currentImage.aspect_ratio }}
        {...handlers}
      >
        {/* Main image */}
        <div className="w-full overflow-hidden">
          <div
            className="relative m-auto flex max-h-[90vh] items-center justify-center"
            style={{ aspectRatio: currentImage.aspect_ratio }}
          >
            {/* Buttons */}
            {loaded && (
              <div
                className="relative z-50 max-h-full w-full"
                style={{ aspectRatio: currentImage.aspect_ratio }}
              >
                {navigation && (
                  <>
                    {index > 0 && (
                      <button
                        className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                        style={{ transform: 'translate3d(0, 0, 0)' }}
                        onClick={() => changePhotoId(index - 1)}
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                    )}
                    {index + 1 < images.length && (
                      <button
                        className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                        style={{ transform: 'translate3d(0, 0, 0)' }}
                        onClick={() => changePhotoId(index + 1)}
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    )}
                  </>
                )}
                <div className="absolute right-0 top-0 flex items-center gap-2 p-3 text-white">
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20pic%20from%20@Willian_Justen!%0A%0Ahttps://photos.willianjusten.com.br/p/${index}`}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    target="_blank"
                    title="Share on Twitter"
                    rel="noreferrer"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    target="_blank"
                    title="Open full quality version"
                    rel="noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                  <button
                    onClick={() =>
                      downloadPhoto(
                        `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`,
                        `${index}.jpg`
                      )
                    }
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                    title="Download full quality version"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute left-0 top-0 flex items-center gap-2 p-3 text-white">
                  <button
                    onClick={() => closeModal()}
                    className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  >
                    {navigation ? (
                      <XMarkIcon className="h-5 w-5" />
                    ) : (
                      <ArrowUturnLeftIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute"
              >
                <CldImage
                  src={currentImage.public_id}
                  width={1920}
                  height={1280}
                  priority
                  alt="Willian Justen - Photo"
                  onLoadingComplete={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons + bottom nav bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {/* Bottom Nav bar */}
          {navigation && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                initial={false}
                className="mx-auto mb-6 mt-6 flex aspect-[3/2] h-14"
              >
                <AnimatePresence initial={false}>
                  {filteredImages.map(({ public_id, format, id }) => (
                    <motion.button
                      initial={{
                        width: '0%',
                        x: `${Math.max((index - 1) * -100, 15 * -100)}%`
                      }}
                      animate={{
                        scale: id === index ? 1.25 : 1,
                        width: '100%',
                        x: `${Math.max(index * -100, 15 * -100)}%`
                      }}
                      exit={{ width: '0%' }}
                      onClick={() => changePhotoId(id)}
                      key={id}
                      className={`${
                        id === index
                          ? 'z-20 rounded-md shadow shadow-black/50'
                          : 'z-10'
                      } ${id === 0 ? 'rounded-l-md' : ''} ${
                        id === images.length - 1 ? 'rounded-r-md' : ''
                      } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                    >
                      <CldImage
                        alt="small photos on the bottom"
                        width={180}
                        height={120}
                        className={`${
                          id === index
                            ? 'brightness-110 hover:brightness-110'
                            : 'brightness-50 contrast-125 hover:brightness-75'
                        } h-full transform object-cover transition`}
                        src={public_id}
                      />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  )
}
