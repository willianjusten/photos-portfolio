import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function ModalNavigation({ images, index, changePhotoId }) {
  return (
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
  )
}
