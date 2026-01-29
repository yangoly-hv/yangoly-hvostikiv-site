import { createClient } from 'next-sanity'

const client = createClient({
    projectId: 'vintpwoh',
    dataset: 'production',
    apiVersion: '2025-05-15',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
})

export default client;
