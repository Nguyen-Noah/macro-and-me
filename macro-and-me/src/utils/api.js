import axios from 'axios';
import { getAuth } from 'firebase/auth';

class API {
    constructor(baseURL) {
        this.api = axios.create({
          baseURL
        });

        // request interceptor to set Firebase token
        this.api.interceptors.request.use(
          async (config) => {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
    
            if (token) {
              config.headers['Authorization'] = `Bearer ${token}`;
            }
    
            return config;
          },
          (error) => Promise.reject(error)
        );

        // response interceptor for error handling
        this.api.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response) {
              console.error('API Error:', error.response.data);
            } else {
              console.error('Network Error:', error.message);
            }
            return Promise.reject(error);
          }
        );
      }
    async get(url, params={}) {
        return this.api.get(url, { params });
    }

    async post(url, data={}) {
        return this.api.post(url, data);
    }

    async put(url, data={}) {
        return this.api.put(url, data);
    }

    async delete(url) {
        return this.api.delete(url);
    }
}

const api = new API('http://localhost:5000/api');
export default api;