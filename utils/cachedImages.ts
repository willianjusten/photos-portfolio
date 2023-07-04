import cloudinary from './cloudinary'

let cachedResults

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .sort_by('folder', 'desc')
      .max_results(2000)
      .execute()

    cachedResults = fetchedResults
  }

  return cachedResults
}
