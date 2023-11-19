import cloudinary from './cloudinary'

let cachedResults

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .sort_by('folder', 'asc')
      .max_results(2000)
      .execute()

    if (fetchedResults?.next_cursor) {
      const moreResults = await cloudinary.v2.search
        .sort_by('folder', 'asc')
        .next_cursor(fetchedResults?.next_cursor)
        .max_results(2000)
        .execute()

      fetchedResults.resources = fetchedResults.resources.concat(
        moreResults.resources
      )
    }

    cachedResults = fetchedResults
  }

  return cachedResults
}
