import { algoliasearch } from 'algoliasearch'

// Server-side admin client (for sync/mutations)
export const getAlgoliaAdminClient = () => {
  const appId = process.env.ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_KEY
  
  if (!appId || !adminKey) {
    return null
  }
  
  return algoliasearch(appId, adminKey)
}

// Client-side / public search client (for searching)
export const getAlgoliaSearchClient = () => {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
  
  if (!appId || !searchKey) {
    return null
  }
  
  return algoliasearch(appId, searchKey)
}
