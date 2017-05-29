// module.exports = {
//     "host":"rm-2zez3wrjdyc22f44t.mysql.rds.aliyuncs.com",
//     "user":"cms_internal",
//     "password":"CmsInternal123",
//     "database":"cms_internal",
//     "charset":"utf8mb4",
//     "multipleStatement":true,
//     "connectionLimit": 15
//  }
const isDebug = process.env.NODE_ENV === 'dev'
const dbConfig = isDebug
  ? {
    cms: {
      host: 'localhost',
      user: 'root',
      password: 'sqltest',
      database: 'cms',
      charset: 'utf8mb4',
      multipleStatement: true,
      connectionLimit: 50
    }
  }
  : {
    cms: {
      host: 'rds7bz3av7bz3av.mysql.rds.aliyuncs.com',
        //  reader是只读帐号，渲染相关的都是只需要读就可以了
        //  'user': 'reader',
        //  'password': 'reader',
      user: 'diaodiao',
      password: 'diaodiao',
      database: 'diaodiao',
      charset: 'utf8mb4',
      multipleStatement: true,
      connectionLimit: 50
    }
  }
console.log(`isDebug:${isDebug}\nuse: ${JSON.stringify(dbConfig)}`)
module.exports = dbConfig
