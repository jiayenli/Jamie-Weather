import axios from 'axios'
const token = '6123e250d58b11b1f33976e2e4c18e2e'
const baseURL = 'https://api.openweathermap.org/data/2.5'
const apiHelper = axios.create({
    baseURL
})

export default {
    getWorldWeather({ q }) {
        return apiHelper.get(`/forecast?q=${q}&lang=zh_tw&units=metric&appid=${token}`)
    },
}