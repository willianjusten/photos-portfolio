import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import { ImageProps } from 'utils/types'

export default function ImageCard({
  id,
  public_id,
  width,
  height,
  blurDataUrl,
  lastViewedPhoto,
  lastViewedPhotoRef,
  folder,
  selectedFolder
}: ImageProps & {
  lastViewedPhoto: string | null
  lastViewedPhotoRef: React.MutableRefObject<HTMLAnchorElement | null>
  selectedFolder: string
}) {
  return (
    <Link
      key={id}
      href={`/?photoId=${id}`}
      as={`/p/${id}`}
      ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
      shallow
      className={`${
        selectedFolder !== 'All' && selectedFolder !== folder ? 'hidden' : ''
      } after:content group relative block w-full  cursor-zoom-in transition after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight`}
    >
      <CldImage
        alt="Willian Justen photo"
        className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
        style={{ transform: 'translate3d(0, 0, 0)' }}
        placeholder="blur"
        blurDataURL={blurDataUrl}
        src={public_id}
        width={width > height ? 1280 : 853}
        height={height > width ? 1280 : 853}
        format="webp"
        loading="lazy"
        sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
      />
    </Link>
  )
}
