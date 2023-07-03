import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { CldImage } from 'next-cloudinary'
import Camera from '../components/Icons/Camera'
import Filter from '../components/Icons/Filter'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('All')
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
          <div className="after:content relative mb-5 flex h-[300px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-6 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="mt-[-40px] flex max-h-full max-w-full items-center justify-center">
                <Camera />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[280px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            <h1 className="mb-4 mt-8 text-xl font-bold tracking-widest">
              Willian Justen - Photography
            </h1>
            <p className="text-white/75 sm:max-w-[45ch]">
              Brazilian based hobbyist photographer and Software Engineer that
              loves to travel and take photos.
            </p>
          </div>
          {images.map(({ id, public_id, blurDataUrl, folder }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className={`${
                selectedFolder !== 'All' && selectedFolder !== folder
                  ? 'hidden'
                  : ''
              } after:content group relative mb-5 block w-full  cursor-zoom-in transition after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight`}
            >
              <CldImage
                alt="Willian Justen photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={public_id}
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

        <menu
          className={`fixed bottom-20 right-5 mb-5 flex w-48 flex-col gap-2 rounded-lg bg-medium p-5 shadow-md transition ${
            menuOpen ? 'visible' : 'invisible'
          }`}
        >
          {folders?.map(folder => (
            <div
              key={folder}
              className={`rounded-fullpx-3 z-10 cursor-pointer py-1 transition hover:text-white ${
                selectedFolder === folder ? 'text-details' : 'text-white/50'
              }`}
              onClick={() => setSelectedFolder(folder)}
            >
              {folder}
            </div>
          ))}

          <div className="h-[1px] border-t-0 bg-neutral-100/20 opacity-100" />

          <div
            className={`rounded-fullpx-3 z-10 cursor-pointer py-1 transition hover:text-white ${
              selectedFolder === 'All' ? 'text-details' : 'text-white/50'
            }`}
            onClick={() => setSelectedFolder('All')}
          >
            All photos
          </div>
        </menu>

        <img
          src="arrow.png"
          alt="Filter by place here"
          className="invisible fixed bottom-24 right-8 h-[450px] ultrawide:visible"
        />

        <button
          className="fixed bottom-6 right-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-medium shadow-md transition hover:bg-medium/90 xl:h-16 xl:w-16"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Filter by place"
        >
          <Filter className="w-9 text-white/50 transition hover:text-white/80 xl:w-10" />
        </button>
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
    .sort_by('public_id', 'desc')
    .max_results(2000)
    .execute()

  let reducedResults: ImageProps[] = []
  let folders: string[] = []

  let i = 0
  for (let result of results?.resources) {
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

  const blurImagePromises = results?.resources?.map((image: ImageProps) => {
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
