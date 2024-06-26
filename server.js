const http = require('http')
require('dotenv').config()
const headers = require('./service/headers')
const Post = require('./model/posts')
const handleSuccess = require('./service/handleSuccess')
const handleError = require('./service/handleError')


//連接資料庫
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_ATLAS_URL)
 .then(res => console.log('成功連接資料庫'))
 .catch(err => console.log('資料庫連接有誤',err.message))

const requestListener = async(req, res) =>{
  let body = ''
  req.on('data', chunk => {
    body += chunk
  })

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
            name: name.trim(),
            content: content.trim(),
            image: image.trim(),
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
        const postId = req.url.split('/').pop()
        const post = await Post.findOne({_id: postId})
        
        let data = JSON.parse(body)
        const allowedKeys = ["name", "content", "image", "likes"]
        for (const key in data) {
          if (!allowedKeys.includes(key)) {
            // 一個請求只能發送一個回應，所以加上return 
            return handleError(res)
          }else if(typeof data[key] === 'string'){
            data[key] = data[key].trim()
          }else{
            data[key] = data[key]
          }
        }

        const { content, image, name, likes } = data
        const result = await Post.findByIdAndUpdate(
          {
            _id: postId
          },
          {
            name,
            content,
            image,
            likes
          },
          {
            new: true
          }
        ) 
        if(result === null){
          handleError(res)
        }else{
          handleSuccess(res, result)
        }
      } catch (error) {
        handleError(res)
        console.log(error.message)
      }
    })

  // 刪除單筆post: DELETE /posts/{{post id}}    
  }else if(req.method === 'DELETE' && req.url.startsWith('/posts/')){
    try {
      const id = req.url.split('/').pop()
      const result = await Post.findByIdAndDelete(id)
      if(result === null){
        handleError(res)
      }else{
        handleSuccess(res, result)
      }
    } catch (error) {
      handleError(res)
      console.log(error.message)
    }
    
    // 刪除全部posts: DELETE /posts
  }else if(req.method === 'DELETE' && req.url === '/posts'){
    try {
      const result = await Post.deleteMany({})
      handleSuccess(res, result)      
    } catch (error) {
      handleError(res)
    }

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

  // const init = async() =>{
  //   await Post.findOne({_id:'66211cf365e00addd554ab69s'})
  //   .then(res=> console.log(res))
  //   .catch(err=> console.log(err))
  //   // console.log(post)
  // }
  // init()
}
const server = http.createServer(requestListener)
server.listen(process.env.PORT || 8080, ()=>{ console.log('監聽8080')})
