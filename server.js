const http = require('http')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_ATLAS_URL)
 .then(res => console.log('成功連接資料庫'))
 .catch(err => console.log('資料庫連接有誤',err.message))
 
const requestListener = (req, res) =>{

}
const server = http.createServer(requestListener)
server.listen(8080, ()=>{ console.log('監聽8080')})
// console.log(http)