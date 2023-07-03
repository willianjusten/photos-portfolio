import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function ModalBack({ navigation, closeModal }) {
  return (
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
  )
}
