import axios from 'axios'
const env = import.meta.env
const token = env.VITE_APP_AUTHORIZATION_KEY
const baseURL = 'https://api.openweathermap.org/data/2.5'
const apiHelper = axios.create({
    baseURL
})

export default {
    getWeathers({ q }) {
        return apiHelper.get(`/forecast?q=${q}&lang=zh_tw&units=metric&appid=${token}`)
    },
    getCurrentWeather({ q }) {
        return apiHelper.get(`/weather?q=${q}&lang=zh_tw&units=metric&appid=${token}`)
    }
}