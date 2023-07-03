import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Camera from '../components/Icons/Camera'
import Modal from '../components/Modal'
import cloudinary from '../utils/cloudinary'
import getBase64ImageUrl from '../utils/generateBlurPlaceholder'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'

const Home: NextPage = ({
  images,
  folders
}: {
  images: ImageProps[]
  folders: string[]
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: 'center' })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  return (
    <>
      <Head>
        <title>Willian Justen - Photography</title>
        <meta
          property="og:image"
          content="https://og-image-service.willianjusten.com.br/Photos.png"
        />
        <meta
          name="twitter:image"
          content="https://og-image-service.willianjusten.com.br/Photos.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId)
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Camera />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <h1 className="mb-4 mt-8 text-xl font-bold tracking-widest">
              Willian Justen - Photography
            </h1>
            <p className="text-white/75 sm:max-w-[45ch]">
              Brazilian based hobbyist photographer and Software Engineer that
              loves to travel and take photos.
            </p>

            <p className="text-white/75 sm:max-w-[45ch]">Filter by places:</p>

            <div className="flex gap-2">
              {folders?.map(folder => (
                <div
                  key={folder}
                  className={`z-10 cursor-pointer rounded-full bg-white px-3 py-1 text-black/80`}
                  onClick={() => setSelectedFolder(folder)}
                >
                  {folder}
                </div>
              ))}

              <div
                className={`z-10 cursor-pointer rounded-[4px] bg-slate-500 px-2 py-1 text-white/80`}
                onClick={() => setSelectedFolder(null)}
              >
                Clear
              </div>
            </div>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl, folder }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className={`${
                selectedFolder && selectedFolder !== folder ? 'opacity-20' : ''
              } after:content group relative mb-5 block w-full  cursor-zoom-in transition after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight`}
            >
              <Image
                alt="Willian Justen photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                loading="lazy"
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Made with 🤍 by{' '}
        <a
          href="https://willianjusten.com.br"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          me
        </a>{' '}
        using this{' '}
        <a
          href="https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer"
        >
          amazing NextJS template.
        </a>
      </footer>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .sort_by('uploaded_at', 'desc')
    .max_results(2000)
    .execute()

  let reducedResults: ImageProps[] = []
  let folders: string[] = []

  let i = 0
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      folder: result.folder,
      height: result.height,
      width: result.width,
      aspect_ratio: result.aspect_ratio,
      public_id: result.public_id,
      format: result.format
    })

    if (!folders.includes(result.folder)) {
      folders.push(result.folder)
    }

    i++
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image)
  })
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return {
    props: {
      images: reducedResults,
      folders
    }
  }
}
