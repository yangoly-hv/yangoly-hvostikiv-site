import { createClient } from 'next-sanity'

const client = createClient({
    projectId: 'vintpwoh',
    dataset: 'production',
    apiVersion: '2025-05-15',
    useCdn: true,
})

export default client;
