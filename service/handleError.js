const headers = require('./headers')

const handleError = (res, headers) =>{
  res.writeHead(400, headers)
  res.write(JSON.stringify(
    {
      "status": "false",
      "message": "欄位填寫錯誤，或無此id"
    }
  ))
  res.end()     
}
module.exports = handleError