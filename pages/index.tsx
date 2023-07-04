import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import cloudinary from 'utils/cloudinary'
import getBase64ImageUrl from 'utils/generateBlurPlaceholder'
import type { ImageProps } from 'utils/types'
import { useLastViewedPhoto } from 'utils/useLastViewedPhoto'
import Menu from 'components/Menu'
import MainCard from 'components/MainCard'
import Modal from 'components/Modal'
import ImageCard from 'components/ImageCard'
import Footer from 'components/Footer'
import InfiniteScroll from 'components/InfiniteScroll'

const Home: NextPage = ({
  images,
  folders
}: {
  images: ImageProps[]
  folders: string[]
}) => {
  const [selectedFolder, setSelectedFolder] = useState('All')
  const router = useRouter()
  const { photoId } = router.query
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef?.current?.scrollIntoView({ block: 'center' })
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
          <MainCard />

          <InfiniteScroll chunkSize={30}>
            {images.map(
              ({ id, public_id, blurDataUrl, width, height, folder }) => (
                <ImageCard
                  key={id}
                  id={id}
                  public_id={public_id}
                  blurDataUrl={blurDataUrl}
                  width={width}
                  height={height}
                  folder={folder}
                  selectedFolder={selectedFolder}
                  lastViewedPhoto={lastViewedPhoto}
                  lastViewedPhotoRef={lastViewedPhotoRef}
                />
              )
            )}
          </InfiniteScroll>
        </div>

        <Menu
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
        />
      </main>

      <Footer />
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
