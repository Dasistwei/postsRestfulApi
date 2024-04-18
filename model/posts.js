const mongoose = require('mongoose')

//建立schema
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫']
    },
    image: {
      type:String,
      default:""
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    name: {
        type: String,
        required: [true, '貼文姓名未填寫']
    },
    likes: {
        type: Number,
        default:0
    }    
  },{
    versionKey: false
  }
)
// 建立model

// postSchema.pre('save', function(next) {
//   const fieldsToTrim = ['content', 'image', 'name', 'likes'];
//   const doc = this
//   console.log(this)
//   fieldsToTrim.forEach(field => {
//     console.log(doc[field])
//     if (doc[field]) {
//       doc[field] = doc[field].trim();
//     }
//   });
//   next()
// })
const Post = mongoose.model('Post', postSchema)
module.exports = Post