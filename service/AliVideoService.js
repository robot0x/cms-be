// const URLSafeBase64 = require('urlsafe-base64')
// const crypto = require('crypto')
class AliVideoService {
  // var wantu = new WANTU('23108204','83908ed2f09d278edd6152bfb6002fb9');  //填入ak，sk
  // var namespace = 'content';   //填写空间名
  constructor () {
    this.ak = 23108204
    this.sk = '83908ed2f09d278edd6152bfb6002fb9'
    this.namespace = 'content'
    this.dir = '/video/user'
  }
  genUploadPolicy (ak = this.ak, sk = this.sk, namespace = this.namespace, dir = this.dir) {
    return {
      dir,
      namespace,
      detectMime: '1',
      insertOnly: '0',
      expiration: -1
    }
  }
  genUploadToken () {
    return 'UPLOAD_AK_TOP MjMxMDgyMDQ6ZXlKa1pYUmxZM1JOYVcxbElqb2lNU0lzSW1sdWMyVnlkRTl1YkhraU9pSXdJaXdpYm1GdFpYTndZV05sSWpvaVkyOXVkR1Z1ZENJc0ltVjRjR2x5WVhScGIyNGlPaTB4TENKa2FYSWlPaUpjTDNacFpHVnZYQzlzZVdZaWZROmE0ZDIyYTU2MGVjODk0M2FjYzI2ZjViMjVhODhmNjlhZWNiYThhOTU'
    // let uploadPolicy = this.genUploadPolicy()
    // console.log('uploadPolicy:', uploadPolicy)
    // let uploadPolicyBaseStr = JSON.stringify(uploadPolicy)
    // let uploadPolicyBase64 = new Buffer(uploadPolicyBaseStr).toString('base64')
    // let uploadPolicySafeBase64 = URLSafeBase64.encode(new Buffer(uploadPolicyBaseStr))
    // console.log('uploadPolicyBase64:', uploadPolicyBase64)
    // console.log('uploadPolicySafeBase64:', uploadPolicySafeBase64)
    // let signed = crypto.createHmac('sha1', this.sk).update(uploadPolicySafeBase64).digest('hex')
    // let data = `${this.ak}:${uploadPolicySafeBase64}:${signed}`
    // let token = `UPLOAD_AK_TOP ${URLSafeBase64.encode(new Buffer(data, 'base64'))}`
    // return token
  }
}

module.exports = AliVideoService
// test
// let wantu = new AliVideoService()
// console.log('token:', wantu.genUploadToken())
