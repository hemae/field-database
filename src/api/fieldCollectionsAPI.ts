import {AxiosResponse} from 'axios'
import {AxiosApi} from './AxiosApi'


const api = new AxiosApi({basePath: 'http://workcard.fun/api/collections'})

export type SaveResponseType = { message: string }
export type SaveAxiosResponseType = AxiosResponse<SaveResponseType>

export type FindResponseType<ModelType> = { items: ModelType[] }
export type FindAxiosResponseType<ModelType> = AxiosResponse<FindResponseType<ModelType>>

export type Find__ResponseType<ModelType> = { item: ModelType | null }
export type Find__AxiosResponseType<ModelType>  = AxiosResponse<Find__ResponseType<ModelType>>

export type FindByIdAndDeleteResponseType = { message: string }
export type FindByIdAndDeleteAxiosResponseType = AxiosResponse<FindByIdAndDeleteResponseType>


export type FieldApiOptionsType<ModelType> = {
    token: string
    data: {
        collectionName: string
        item?: ModelType
        filter?: object
        itemId?: string
        update?: object
    }
}


export const fieldCollectionsAPI = {
    save<ModelType>({token, data}: FieldApiOptionsType<ModelType>): Promise<SaveAxiosResponseType> {
        return api.getPromiseResponse<SaveResponseType>({path: '/save', method: 'put', token, data})
    },
    find<ModelType>({token, data}: FieldApiOptionsType<ModelType>): Promise<FindAxiosResponseType<ModelType>> {
        return api.getPromiseResponse<FindResponseType<ModelType> >({path: '/find', method: 'post', token, data})
    },
    findById<ModelType>({token, data}: FieldApiOptionsType<ModelType>): Promise<Find__AxiosResponseType<ModelType> > {
        return api.getPromiseResponse<Find__ResponseType<ModelType> >({path: '/findById', method: 'post', token, data})
    },
    findOne<ModelType>({token, data}: FieldApiOptionsType<ModelType>): Promise<Find__AxiosResponseType<ModelType> > {
        return api.getPromiseResponse<Find__ResponseType<ModelType> >({path: '/findOne', method: 'post', token, data})
    },
    findByIdAndUpdate<ModelType>({token, data}: FieldApiOptionsType<ModelType>): Promise<Find__AxiosResponseType<ModelType> > {
        return api.getPromiseResponse<Find__ResponseType<ModelType> >({
            path: '/findByIdAndUpdate',
            method: 'post',
            token,
            data
        })
    },
    findByIdAndDelete<ModelType>({token, data}: FieldApiOptionsType<ModelType>): Promise<FindByIdAndDeleteAxiosResponseType> {
        return api.getPromiseResponse<FindByIdAndDeleteResponseType>({
            path: '/findByIdAndDelete',
            method: 'post',
            token,
            data
        })
    }
}
