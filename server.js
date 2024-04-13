const http = require('http')
require('dotenv').config()
const Post = require('./model/posts')
const handleSuccess = require('./service/handleSuccess')
const handleError = require('./service/handleError')


//連接資料庫
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_ATLAS_URL)
 .then(res => console.log('成功連接資料庫'))
 .catch(err => console.log('資料庫連接有誤',err.message))

 const init = async() =>{
  try {
    // 1. 查詢：Model.find()
    //  const posts = await Post.find({})
    // 2. 新增：Model.create()
    // const data = { content: '貼文1', name: '小花' }
    // const result = await Post.create(
    //   {
    //     name: data.name,
    //     content: data.content
    //   }
    // )
    // 3. 更新：Model.findByIdAndUpdate() 
    // const result = await Post.findByIdAndUpdate(
    //   {
    //     _id: '6619637b8858fe02aef229d4'
    //   },
    //   {
    //     name: '小明',
    //     content: '更新1'
    //   }
    // )
    // console.log(result)
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

  // CRUD
  // 取得所有posts:  GET /posts
  if (req.url === '/posts' && req.method === 'GET') {
    const posts = await Post.find()
    handleSuccess(res, posts)

  // 新增 post: POST /posts
  }else if(req.url === '/posts' && req.method === 'POST'){
    req.on('end', async()=>{
      try {
        const { content, image, name, likes } = JSON.parse(body)
        const result = await Post.create(
          {
            name,
            content,
            image,
            likes
          }
        )
        handleSuccess(res, result)     
      } catch (error) {
        handleError(res)
      }
    })
  // 修改單筆post: PATCH /posts/{{post id}}
  } else if(req.url.startsWith('/posts/') && req.method === 'PATCH'){
    req.on('end', async()=>{
      try {
        const { content, image, name, likes } = JSON.parse(body)
        const postId = req.url.split('/').pop()
        const post = await Post.findOne({ _id: postId })
        const result = await Post.findByIdAndUpdate(
          {
            _id: postId
          },
          {
            name,
            content,
            image,
            likes
          }
        ) 

        handleSuccess(res, result)
        
      } catch (error) {
        handleError(res)
        console.log(error.message)
      }
    })

  // 刪除單筆post: DELETE /posts/{{post id}}    
  }else if(req.method === 'DELETE' && req.url.startsWith('/posts/')){
    const id = req.url.split('/').pop()
    const result = await Post.findByIdAndDelete(id)
    handleSuccess(res, result)

  }else if(req.method === 'DELETE' && req.url === '/posts'){
    const result = await Post.deleteMany({})
    handleSuccess(res, result)

  }else if(req.method === 'OPTIONS'){
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

  // 刪除全部posts: DELETE /posts

}
const server = http.createServer(requestListener)
server.listen(8080, ()=>{ console.log('監聽8080')})
// console.log(http)