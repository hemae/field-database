import axios, {AxiosInstance, AxiosResponse} from 'axios'


type ContentType = 'application/json' | 'multipart/form-data'

type InstanceCreatorOptionsType = {
    token: string | undefined
    contentType: ContentType
}

type GetPromiseAxiosResponseType = {
    method: 'get' | 'post' | 'put' | 'delete'
    path: string
    token?: string
    data?: object
}

type AxiosApiOptionsType = {
    basePath?: string
    contentType?: ContentType
}

export class AxiosApi {

    readonly _basePath: string = ''
    readonly _contentType: ContentType = 'application/json'

    constructor(options: AxiosApiOptionsType) {
        this._basePath = options.basePath || ''
        this._contentType = options.contentType || 'application/json'
    }

    public getPromiseResponse<ResponseType>({method, token, path, data = {}}: GetPromiseAxiosResponseType): Promise<AxiosResponse<ResponseType>> {
        return method === 'get' || method === 'delete'
            ? AxiosApi._instanceCreator({
                token,
                contentType: this._contentType
            })[method]<ResponseType>(`${this._basePath}${path}`)
            : AxiosApi._instanceCreator({
                token,
                contentType: this._contentType
            })[method]<ResponseType>(`${this._basePath}${path}`, JSON.stringify(data))
    }

    static _instanceCreator({token, contentType}: InstanceCreatorOptionsType): AxiosInstance {
        return axios.create({
            headers: {
                'Content-Type': contentType,
                'Authorization': `${token ? `Bearer ${token}` : ''}`
            }
        })
    }
}
