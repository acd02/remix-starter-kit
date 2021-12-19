import sanityClient from '@sanity/client'

export const sanity = sanityClient({
  apiVersion: '2021-12-19',
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'prod',
  token: process.env.SANITY_TOKEN, // or leave blank to be anonymous user
  useCdn: false, // `false` if you want to ensure fresh data
})
