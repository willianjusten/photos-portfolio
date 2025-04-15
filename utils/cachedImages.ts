import cloudinary from './cloudinary'

let cachedResults

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

export default async function getResults() {
  if (!cachedResults) {
    cachedResults = await getAllResults()
  }

  return cachedResults
}
