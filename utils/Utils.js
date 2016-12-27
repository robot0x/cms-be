class Utils {

  // 短id转长id
  static getLongCid (cid) {
    if (cid == void 0) { // eslint-disable-line
      return void 0
    }
    const C = Math.pow(2, 32)
    // 如果cid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
    return cid > C
    ? cid
    : (C + 1) * cid
  }

  // 长id短id
  static getShortCid (cid) {
    if (cid == void 0) {  // eslint-disable-line
      return void 0
    }
    const C = Math.pow(2, 32)
    // 如果cid小于常数，我们认为就是短ID，直接返回即可，否则再进行处理
    return cid < C
    ? cid & 0xffffff
    : cid
  }

  // 获取stamp
  static getStamp (divisor = 1) {
    return Date.now() / divisor
  }

  // 获取文件扩展名
  static getFileExtension( filename = '' ) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  }

}

module.exports = Utils
