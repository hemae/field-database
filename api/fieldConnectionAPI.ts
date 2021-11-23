import {AxiosApi} from './AxiosApi'
import {AxiosResponse} from 'axios'


const api = new AxiosApi({basePath: 'http://localhost:5000/api/connect'})

export type ConnectResponseType = {message: string}
export type ConnectAxiosResponseType = AxiosResponse<ConnectResponseType>

export type FieldConnectionApiOptionsType = {
    token: string
}

export const fieldConnectionAPI = {
    connect({token}: FieldConnectionApiOptionsType): Promise<ConnectAxiosResponseType> {
        return api.getPromiseResponse<ConnectResponseType>({path: '/', method: 'get', token})
    }
}
