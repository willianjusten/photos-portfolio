import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Fragment, useState, useEffect, useRef } from 'react'
import { Masonry } from 'react-plock'
import cloudinary from 'utils/cloudinary'
import getBase64ImageUrl from 'utils/generateBlurPlaceholder'
import type { ImageProps } from 'utils/types'
import { useLastViewedPhoto } from 'utils/useLastViewedPhoto'
import Menu from 'components/Menu'
import MainCard from 'components/MainCard'
import Modal from 'components/Modal'
import ImageCard from 'components/ImageCard'

const Home: NextPage = ({
  images,
  folders
}: {
  images: ImageProps[]
  folders: string[]
}) => {
  const [showMain, setShowMain] = useState(true)
  const [data, setData] = useState(images)
  const [selectedFolder, setSelectedFolder] = useState('All')
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const initialLoadCount = 20
  const chunkSize = 20
  const [visibleImages, setVisibleImages] = useState([])

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef?.current?.scrollIntoView({ block: 'center' })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  useEffect(() => {
    const handleScroll = () => {
      if (!window) return
      const windowHeight =
        'innerHeight' in window
          ? window.innerHeight
          : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      )
      const windowBottom = windowHeight + window.pageYOffset
      const threshold = 200 // Adjust the threshold value as per your requirements

      if (windowBottom >= docHeight - threshold) {
        // We've reached the bottom of the page (with threshold), load more images
        const nextChunk = data.slice(
          visibleImages.length,
          visibleImages.length + chunkSize
        )
        setVisibleImages(prevVisibleImages => [
          ...prevVisibleImages,
          ...nextChunk
        ])
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [visibleImages, data, chunkSize])

  useEffect(() => {
    const initialVisibleImages = data.slice(0, initialLoadCount)
    setVisibleImages(initialVisibleImages)
  }, [data, initialLoadCount])

  useEffect(() => {
    setData(
      images.filter(({ folder }) =>
        selectedFolder === 'All' ? true : folder === selectedFolder
      )
    )
  }, [selectedFolder])

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

        <Masonry
          items={visibleImages}
          config={{
            columns: [1, 2, 3, 4],
            gap: [16, 16, 16, 16],
            media: [640, 980, 1280, 1536]
          }}
          render={({ id, public_id, blurDataUrl, width, height }, index) => {
            return (
              <Fragment key={id}>
                {showMain && <MainCard ref={() => setShowMain(false)} />}
                <ImageCard
                  key={id}
                  id={id}
                  public_id={public_id}
                  blurDataUrl={blurDataUrl}
                  width={width}
                  height={height}
                  lastViewedPhoto={lastViewedPhoto}
                  lastViewedPhotoRef={lastViewedPhotoRef}
                />
              </Fragment>
            )
          }}
        />

        <Menu
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      </main>
    </>
  )
}

export default Home

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .sort_by('folder', 'asc')
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
