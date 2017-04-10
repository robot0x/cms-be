class Utils {
  // 短id转长id
  static getLongId (nid) {
    if (nid == void 0) { // eslint-disable-line
      return void 0
    }
    const C = Math.pow(2, 32)
    // 如果nid大于常数，我们认为就是长ID，直接返回即可，否则再进行处理
    return nid > C
    ? nid
    : (C + 1) * nid
  }

  // 长id短id
  static getShortId (nid) {
    if (nid == void 0) {  // eslint-disable-line
      return void 0
    }
    const C = Math.pow(2, 32)
    // 如果nid大于常数，我们认为就是长ID，转成短ID，否则直接返回
    return nid > C
      ? nid & 0xffffff
      : nid;
  }

  // 获取文件扩展名
  // http://leftstick.github.io/tech/2016/04/23/how-to-get-the-file-extension-more-efficiently
  static getFileExtension( filename = '' ) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
  }

}

module.exports = Utils
