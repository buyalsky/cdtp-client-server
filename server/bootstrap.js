const mongoose = require('mongoose')

mongoose.connect(`mongodb://localhost/cdtp`, {useNewUrlParser: true}).then()

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
