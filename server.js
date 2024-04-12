const http = require('http')
require('dotenv').config()
const Post = require('./model/posts')
//連接資料庫
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_ATLAS_URL)
 .then(res => console.log('成功連接資料庫'))
 .catch(err => console.log('資料庫連接有誤',err.message))

 const init = async() =>{
  try {
    // 新增：Model.create()
    const data = { content: '貼文1', name: '小花' }
    const result = await Post.create(
      {
        name: data.name,
        content: data.content
      }
    )
    console.log(result)
    // const posts = await Post.find({})
    // console.log(posts)
  } catch (error) {
    console.log(error.message)
  }
}
// init()
const requestListener = async(req, res) =>{
  let body = ''
  req.on('data', chunk => {
    body += chunk
  })
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Aithorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json' 
  }  
  // CRUD
  // 取得所有posts:  GET /posts
  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find()
    res.writeHead(200, headers)
    res.write(JSON.stringify(
      {
        "status": "success",
        data: posts
      }
    ))
    res.end()

  //新增POST
  }else if(req.url === '/posts' && req.method === 'POST'){
    req.on('end', async()=>{
      try {
        const data = JSON.parse(body)
        const result = await Post.create(
          {
            name: data.name,
            content: data.content
          }
        )
        res.writeHead(200, headers)
        res.write(JSON.stringify(
          {
            "status": "success",
            "data": result
          }
        ))
        res.end()        
      } catch (error) {
        res.writeHead(400, headers)
        res.write(JSON.stringify(
          {
            "status": "false",
            "message": "欄位填寫錯誤"
          }
        ))
        res.end()       
      }
    })
  } else if(req.method === 'OPTIONS'){
    res.writeHead(200, headers)
    res.end()
  } else {
    res.writeHead(404, headers)
    res.write(JSON.stringify(
      {
        "status": false,
        "message": "查無無此頁面"
      }
    ))
    res.end()
  }
  // 新增 post: POST /posts
  // 修改單筆post: PATCH /posts/{{post id}}
  // 刪除單筆post: DELETE /posts/{{post id}}
  // 刪除全部posts: DELETE /posts

}
const server = http.createServer(requestListener)
server.listen(8080, ()=>{ console.log('監聽8080')})
// console.log(http)