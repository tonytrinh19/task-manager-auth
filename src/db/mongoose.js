const { response } = require('express')
const mongoose = require('mongoose')

// name of database included in the url
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


// Create model


// const me = new User({
//     name: '    Toni    ',
//     email: '      toni@tonitrinh.com     ',
//     password: '     tung'
// })

// me.save()
//     .then(result => console.log(result))
//     .catch(error => console.log(error))




// const laundry = new Task({
//     description: '     Add description to the database   '
// })

// laundry.save()
// .then(() => console.log(laundry))
// .catch(error => console.log(error))