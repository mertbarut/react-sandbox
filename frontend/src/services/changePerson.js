import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = async () => {
    const request = axios.get(baseUrl)
	const response = await request
	return response.data
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    remove: remove
}