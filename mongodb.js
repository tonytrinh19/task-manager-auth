// CRUD create, read, update, delete

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

// Destructuring
const {
    MongoClient,
    ObjectID
} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
const id = new ObjectID()

// console.log(id.id)
// console.log(id.toHexString())
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }
    const db = client.db(databaseName)

    // db.collection('user').insertOne({
    //     _id: id,
    //     name: 'Steve Jobs',
    //     age: 22
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user!')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('user').insertMany([
    //     {
    //         name: 'Toni',
    //         age: 22
    //     },
    //     {
    //         title: 'Usage',
    //         tag: 'Proper Twelve'
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert data!')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').findOne({
    //     _id: new ObjectID('6096e71381faa14f28dd68dc')
    // }, (error, result) => {
    //     if (error) {
    //         console.log('Unable to fetch!')
    //     }
    //     console.log(result)
    // })

    // db.collection('tasks').find({
    //     completed: false
    // }).toArray((error, task) => {
    //     if (error) {
    //         console.log('Unable to fetch!')
    //     }
    //     console.log(task)
    // })


    // Promise instead of callback
    // db.collection('user').updateOne({
    //     _id: new ObjectID('6096e35657428f37587f702f')
    // }, {
    //     $set: {
    //         name: 'Johnson',
    //         age: 25
    //     }
    // }).then(result => console.log(result)).catch(error => console.log(error))

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then(result => console.log(result.matchedCount)).catch(error => console.log(error))

    // db.collection('user').deleteMany({
    //     age: 22
    // }).then(result => console.log(result)).catch(error => console.log(error))


    db.collection('tasks').deleteOne({
        description: 'Do laundry'
    }).then(result => console.log(result)).catch(error => console.log(error))
})