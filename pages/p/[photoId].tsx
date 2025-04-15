import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Carousel from '../../components/Carousel'
import getResults from '../../utils/cachedImages'
import cloudinary from '../../utils/cloudinary'
import { CldOgImage } from 'next-cloudinary'
import getBase64ImageUrl from '../../utils/generateBlurPlaceholder'
import type { ImageProps } from '../../utils/types'

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter()
  const { photoId } = router.query
  let index = Number(photoId)

  return (
    <>
      <Head>
        <title>Willian Justen - Photography</title>
      </Head>
      <CldOgImage src={currentPhoto.public_id} alt="Willian Justen - Photo" />

      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async context => {
  const results = await getResults()

  let reducedResults: ImageProps[] = []
  let i = 0
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      aspect_ratio: result.aspect_ratio,
      public_id: result.public_id,
      format: result.format
    })
    i++
  }

  const currentPhoto = reducedResults.find(
    img => img.id === Number(context.params.photoId)
  )
  currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto)

  return {
    props: {
      currentPhoto: currentPhoto
    }
  }
}

async function getAllResults(cursor = null, allResources = []) {
  const results = await cloudinary.v2.search
    .sort_by('folder', 'desc')
    .max_results(2000)
    .next_cursor(cursor)
    .execute()

  allResources.push(...results.resources)

  if (results.next_cursor) {
    return getAllResults(results.next_cursor, allResources)
  }

  return { resources: allResources }
}

export async function getStaticPaths() {
  const results = await getAllResults()

  let fullPaths = []
  for (let i = 0; i < results.resources.length; i++) {
    fullPaths.push({ params: { photoId: i.toString() } })
  }

  return {
    paths: fullPaths,
    fallback: false
  }
}
