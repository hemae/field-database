# field-database
fieldDB object modeling for node.js

## Table of contents
* [Features](#features)
* [Installing](#installing)
* [Example](#example)
    + [Model creation](#model-creation)
    + [Connection](#connection)
    + [Usage](#usage)
    + [Available methods](#available-methods)
        - [save](#save)
        - [find](#find)
        - [findById](#findById)
        - [findOne](#findOne)
        - [findByIdAndUpdate](#findByIdAndUpdate)
        - [findByIdAndDelete](#findByIdAndDelete)
* [Errors](#errors)

<a name="features"><h2>Features</h2></a>
* creation of custom classes (models) for the production of the required objects according to a pre-specified scheme
* validation of created objects by type, need for data availability, existence of declared keys (setting when creating a model)

<a name="installing"><h2>Installing</h2></a>
Add the package to your project
```
npm i filed-database
```

<a name="example"><h2>Example</h2></a>


<a name="model-creation"><h3>Model creation</h3></a>
To create model that will be used in you project, use function __Model__ provided by *field-database*          
Export last one:
```javascript
const {FieldDocumentType, Model} = require('field-database')

const schema = {
    messageText: {type: 'string', required: true},
    date: {type: 'number', required: true},
    note: {type: 'string', default: null},
    deleted: {type: 'boolean', default: false},
    likes: {type: 'object', default: []}
}

const Message = Model('message', schema)

export default Message
```

using TypeScript:
```typescript
import {FieldDocumentType, Model} from 'field-database'


export type MessageType = FieldDocumentType & {
    messageText: string
    date: number
    note: string | null
    deleted: boolean
    likes: Array<string>
}

const schema = {
    messageText: {type: 'string', required: true},
    date: {type: 'number', required: true},
    note: {type: 'string', default: null},
    deleted: {type: 'boolean', default: false},
    likes: {type: 'object', default: []}
}


const Message = Model<MessageType>('message', schema)

export default Message
```

When we create a schema for the model, we may specify *type*, *require* and *default* parameters.      
*type* may be:
* 'number'
* 'string'
* 'boolean'
* 'object' (arrays, objects and *null*)

*type* is required in schema, other are optional. Default value of *required* is *false*, for *default* is *undefined*

---
<a name="connection"><h3>Connection to database</h3></a>
*!Before connecting to database, make you sure you have network connection!*         
Usning express (TypeScript):
```typescript
import {Express} from 'express'
const express = require('express')
import field from 'field-database'

const app: Express = express()
const PORT: number = 5000
async function start() {
    try {
        await field.connect({
            login: 'test',
            password: '111111',
            projectId: 'Project ID'   // you can create a project 
        })
        console.log('FieldDB is connected')
        app.listen(PORT, () => log.info(`Server has been started on port ${PORT}`))
    } catch (e: any) {
        console.log(`Server Error: ${e.message}`)
        process.exit(1)
    }
}

start()
```

---
<a name="usage"><h3>Usage</h3></a>
Continuing with the example above, using express router.      
Here we create new instance providing initial parameters.        
Method *save* makes corresponding records in database.     

```typescript
import Message from '../models/Message'
const router: IRouter = Router()

router.put('/',
    async (req, res) => {
        try {
            const {messageText} = req.body as {messageText: string}
            const message = new Message({
                messageText,
                date: Date.now()
            })
            await message.save()
            res.json({message})
        } catch (e: any) {
            log.error(e.message)
            res.status(500).json({message: 'Something went wrong'})
        }
    }
)
```
If we try to look what object *message* is, we can see:

```
{
    _id: 'some id',
    _creationDate: 1637876142324,
    _updatingDate: null,
    messageText: 'some message text',
    date: 1637876142324,
    note: null,
    deleted: false,
    likes: []
}
```

---
<a name="available-methods"><h3>Available methods</h3></a>
Demo version of the database make available following asynchronous methods

<a name="save"><h4>save</h4></a>
*save* is instance method. It saves object record in database and returns a Promise without payload (void)
```typescript
await message.save()
```

<a name="find"><h4>find</h4></a>
*find* is static method. It returns a Promise with array payload:
```typescript
// you can use this method without any parameters
// and get all objects from collection with model Message
const messages = await Message.find()

// as well as with object parameter named *filter*
// in this case we will get only objects according to filter value
const ownerMessages = await Message.find({ownerId: 'some id of owner'})

// filter can be compound
const ownerDelitedMessages = await Message.find({ownerId: 'some id of owner', deleted: true})
```

<a name="findById"><h4>findById</h4></a>
*findById* is static method. It returns a Promise with object or *null* payload:
```typescript
// we should to provide only one parameter: id
const message = await Message.findById('some message id')
// if database find corresponding object we get object, else: null
```

<a name="findOne"><h4>findOne</h4></a>
*findOne* is static method. It returns a Promise with object or *null* payload like *findById*
```typescript
// but now we should to provide any *filter* instead of *id*
const message = await Message.findById({messageText: 'This is message'})
// in this case we get the first found object with filed 'messageText' equal to 'This is message'
// or *null* if object noy found
```

<a name="findByIdAndUpdate"><h4>findByIdAndUpdate</h4></a>
*findByIdAndUpdate* is also static method. It updates the object according provided *filter* and returns a Promise with object or *null*
```typescript
let newMessageText = 'this is new message text'
// if we need updated object
const message = await Message.findByIdAndUpdate('some message id', {messageText: newMessageText})
// also we can ignore promise payload 
await Message.findByIdAndUpdate('some message id', {messageText: newMessageText})
```

<a name="findByIdAndDelete"><h4>findByIdAndDelete</h4></a>
*findByIdAndDelete* is static. It delete the object according provided *id* and returns a Promise without payload (void)
```typescript
await Message.findByIdAndDelete('some message id')
```

---
<a name="errors"><h3>Errors</h3></a>
With creation we should provide all required parameters without default values. Also we have to pass values of the correct types.
If we make the mistake, we can get one of following error messages:

```
Property "messageText" is required on type Message
```

```
Property "messageLikes" does not exist on type Message
```

```
Property "messageText" should be "string" type but got "number"
```
