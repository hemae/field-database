import fieldCollectionsAPI from './api/fieldCollectionsAPI'
import {Capitalize, keysComparator} from './tools/helpers'
import {readFileSync, writeFileSync} from 'fs'
import idGenerator from './tools/idGenerator'
import fieldConnectionAPI from './api/fieldConnectionAPI'


const path = require('path')
const tokenPath = path.join(__dirname, 'token.dat')

export type FieldDocumentType = {
    _id: string
    _creationDate: number
    _updatingDate: number | null
    save: () => void
}

export function Model<ModelType extends FieldDocumentType>(modelName: string, schema: any) {

    const dateCreator = (): number => Date.now()

    const collectionName = modelName.toLowerCase() + `${modelName[modelName.length - 1] === 's' ? 'es' : 's'}`

    function objectCreator(this: ModelType, options: any) {

        for (let key in schema) {
            if (schema[key].required && !options.hasOwnProperty(key)) {
                throw new Error(`Property "${key}" is required on type ${Capitalize(modelName)}`)
            }
        }

        try {
            keysComparator(schema, options, modelName)
        } catch (e: any) {
            throw new Error(e.message)
        }

        this._id = idGenerator()
        this._creationDate = dateCreator()
        this._updatingDate = null
        this.save = async function (): Promise<void> {
            const token = readFileSync(tokenPath, 'utf8')
            try {
                await fieldCollectionsAPI.save<ModelType>({data: {collectionName, item: this}, token})
            } catch (e: any) {
                throw new Error(`Save error: (${e.response.data.message})`)
            }
        }
        for (let key in schema) {
            if (schema.hasOwnProperty(key)) {
                //@ts-ignore
                this[key] = options[key] || schema[key].default || null
            }
        }

    }

    objectCreator.find = async function (filter?: any): Promise<Array<ModelType>> {
        if (filter) {
            try {
                keysComparator(schema, filter, modelName)
            } catch (e: any) {
                throw new Error(e.message)
            }
        }
        const token = readFileSync(tokenPath, 'utf8')
        const response = await fieldCollectionsAPI.find<ModelType>({data: {collectionName, filter}, token})
        return response.data.items
    }

    objectCreator.findById = async function (id: string): Promise<ModelType | null> {
        const token = readFileSync(tokenPath, 'utf8')
        const response = await fieldCollectionsAPI.findById<ModelType>({data: {collectionName, itemId: id}, token})
        return response.data.item
    }

    objectCreator.findOne = async function (filter: any): Promise<ModelType | null> {
        if (filter) {
            try {
                keysComparator(schema, filter, modelName)
            } catch (e: any) {
                throw new Error(e.message)
            }
        }
        const token = readFileSync(tokenPath, 'utf8')
        const response = await fieldCollectionsAPI.findOne<ModelType>({data: {collectionName, filter}, token})
        return response.data.item
    }

    objectCreator.findByIdAndUpdate = async function (id: string, update: any): Promise<ModelType | null> {
        if (update) {
            try {
                keysComparator(schema, update, modelName)
            } catch (e: any) {
                throw new Error(e.message)
            }
        }
        const token = readFileSync(tokenPath, 'utf8')
        const response = await fieldCollectionsAPI.findByIdAndUpdate<ModelType>({
            data: {collectionName, itemId: id, update},
            token
        })
        return response.data.item

    }

    objectCreator.findByIdAndDelete = async function (id: string): Promise<void> {
        const token = readFileSync(tokenPath, 'utf8')
        await fieldCollectionsAPI.findByIdAndDelete<ModelType>({data: {collectionName, itemId: id}, token})
    }

    return objectCreator
}


class Field {
    async connect(authData: {
        login: string,
        password: string,
        projectId: string
    }): Promise<void> {
        try {
            const token = `login|${authData.login}|password|${authData.password}|projectId|${authData.projectId}`
            writeFileSync(tokenPath, token, 'utf8')
            await fieldConnectionAPI.connect({token})
        } catch (e: any) {
            throw new Error(`FieldDB connection error: (${e.response.data.message})`)
        }
    }
}


export default new Field()