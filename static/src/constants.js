export default {
    API_URL: process.env.NODE_ENV === 'production' ? window.location.origin : (window.apiURL || 'http://localhost:33001')
}