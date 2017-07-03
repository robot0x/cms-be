const crypto = require('crypto')
class Utils {
  static getSha1 (text) {
    // http://www.nodeclass.com/articles/63795
    // return crypto.createHmac('sha1', key).update(text, 'utf8').digest('HEX')
    return crypto.createHash('sha1').update(text, 'utf8').digest('HEX')
  }
  /**
   * 判断一个url是否包含 形如 http:// or https:// or // 协议头
   */
  static hasProtocol (url) {
    return url && Utils.HTTP_PROTOCOL_REG.test(url)
  }
   /**
   * 输入形如：
   *  1. //content.image.alimmdn.com/cms/sites/default/files/20160122/experience/kk.jpg
   *  2. http://content.image.alimmdn.com/cms/sites/default/files/20141014/firstpage/coffeelast.jpg
   *  3. https://content.image.alimmdn.com/cms/sites/default/files/20150120/experience/0_0.jpg
   * 输出：
   *  1. content.image.alimmdn.com/cms/sites/default/files/20160122/experience/kk.jpg
   *  2. content.image.alimmdn.com/cms/sites/default/files/20141014/firstpage/coffeelast.jpg
   *  3. content.image.alimmdn.com/cms/sites/default/files/20150120/experience/0_0.jpg
   */
  static removeProtocolHead (url) {
    try {
      // 如果url不存在或者不是以 http:// or https:// or // 开头，则直接返回url
      if (!Utils.hasProtocol(url)) {
        return url
      }
      url = url.replace(Utils.HTTP_PROTOCOL_REG, '')
      return url
    } catch (e) {
      return url
    }
  }
  static ctypeToType (ctype) {
    console.log('Utils.ctypeToType the ctype is ', ctype)
    ctype = Number(ctype)
    // 1-首页/2-好物/3-专刊/4-活动/5-经验/7-值得买/8-评测/9-专题
    let type = ''
    switch (ctype) {
      case 1:
        type = 'firstpage'
        break
      case 2:
        type = 'goodthing'
        break
      case 3:
        type = 'zhuankan'
        break
      case 4:
        type = 'activity'
        break
      case 5:
        type = 'experience'
        break
      case 7:
        type = 'zdm'
        break
      case 8:
        type = 'ceping'
        break
      case 9:
        type = 'zhuanti'
        break
      default:
        type = ''
    }
    return type
  }
  static toShortId (ids) {
    const factor = 4294967297 // Math.pow(2, 32) + 1
    const factor2 = 0xffffff
    const numReg = /^\d+$/
    let ret = null
    if (Utils.isValidArray(ids)) {
      ret = []
      for (let id of ids) {
        if (numReg.test(id)) {
          if (id >= factor) {
            ret.push(id & factor2)
          } else {
            ret.push(id)
          }
        }
      }
    } else if (numReg.test(ids)) {
      if (ids >= factor) {
        ret = ids & factor2
      } else {
        ret = ids
      }
    }
    return ret
  }

  static toLongId (ids) {
    const factor = 4294967297 // Math.pow(2, 32) + 1
    const numReg = /^\d+$/
    let ret = null
    if (Utils.isValidArray(ids)) {
      ret = []
      for (let id of ids) {
        if (numReg.test(id)) {
          if (id < factor) {
            ret.push(id * factor)
          } else {
            ret.push(id)
          }
        }
      }
    } else if (numReg.test(ids)) {
      if (ids < factor) {
        ret = ids * factor
      } else {
        ret = ids
      }
    }
    return ret
  }

  static isValidArray (array) {
    return array && Array.isArray(array) && array.length > 0
  }

  // 获取数组中第一个元素
  static getFirst (data) {
    if (Utils.isValidArray(data)) {
      [data] = data
    } else {
      data = null
    }
    return data
  }

  // 获取文件扩展名
  // http://leftstick.github.io/tech/2016/04/23/how-to-get-the-file-extension-more-efficiently
  static getFileExtension (filename = '') {
    // 形如 content.image.alimmdn.com/sku/1492441129999184_jpg.jpeg@200w_200h_1e%7C200x200-5rc ，的url，得到的扩展名为jpeg@200w_200h_1e%7C200x200-5rc，显然是有问题的
    const extensionName = filename.slice(
      ((filename.lastIndexOf('.') - 1) >>> 0) + 2
    )
    if (extensionName && extensionName.indexOf('@') !== -1) {
      return extensionName.split('@')[0]
    }
    return extensionName
  }
}
Utils.HTTP_PROTOCOL_REG = /^(https?:)?\/\//i
// console.log(Utils.removeProtocolHead('content.image.alimmdn.com/cms/10527/149905160587782118703051.jpg'))
// console.log(Utils.removeProtocolHead('http://content.image.alimmdn.com/cms/10527/149905160587782118703051.jpg'))
// console.log(Utils.removeProtocolHead('//content.image.alimmdn.com/cms/10527/149905160587782118703051.jpg'))
// console.log(Utils.removeProtocolHead('https://content.image.alimmdn.com/cms/10527/149905160587782118703051.jpg'))
// console.log(Utils.getSha1('李彦峰' + Date.now()))
// console.log(Utils.getSha1('liyanfeng' + Date.now()))
module.exports = Utils
