export const API_ROOT = '/api'
let parentSiteURL = '__PARENT_SITE_URL__'
if(parentSiteURL.startsWith('__')) parentSiteURL = 'https://osa.codeandsoda.hu'
export const PARENT_SITE_URL = parentSiteURL
export const MAX_UPLOAD_SIZE_BYTES = 10_000_000