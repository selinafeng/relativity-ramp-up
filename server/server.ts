// const server = require("./app")
import {app, port} from './app'

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})