import axios from 'axios'

const instance= axios.create({
    baseURL:"https://burger-builder-9e56e.firebaseio.com/"
})

export default instance; 