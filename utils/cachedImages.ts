import cloudinary from './cloudinary'

let cachedResults

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .sort_by('public_id', 'desc')
      .sort_by('folder', 'desc')
      .execute()

    cachedResults = fetchedResults
  }

  return cachedResults
}
