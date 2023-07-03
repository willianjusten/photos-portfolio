import { CldImage } from 'next-cloudinary'
import { AnimatePresence, motion } from 'framer-motion'

export default function ModalBottomBar({
  images,
  filteredImages,
  index,
  changePhotoId
}) {
  return (
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
                id === index ? 'z-20 rounded-md shadow shadow-black/50' : 'z-10'
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
  )
}
