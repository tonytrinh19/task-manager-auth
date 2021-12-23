const app = require('./app')
port = process.env.PORT
app.listen(port, () => console.log('Server is up on port', port))