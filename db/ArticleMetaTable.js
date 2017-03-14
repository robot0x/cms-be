const _ = require('lodash')
const Table = require('./Table')
const log4js = require('log4js')
const logger = log4js.getLogger()
const ArticleContentTable = require('./ArticleContentTable')
const ImageTable = require('./ImageTable')
const articleContentTable = new ArticleContentTable()
const imageTable = new ImageTable()

class ArticleMetaTable extends Table {

  constructor() {
    super('article_meta', [
      'id', // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
      // 'nid', // int(11) unsigned NOT NULL unique COMMENT '文章的短id',
      'title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'share_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'wx_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'wb_title', // text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章title',
      'ctype', // tinyint(2) unsigned NOT NULL COMMENT '文章类型',

      'user', // varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
      'author', // varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '文章作者id',
      'lock_by', // varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '被那个作者锁定',
      'last_update_by' // varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '被那个作者锁定',
    ],
    {
      columns: [
        'create_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
        'last_update_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '文章最后更新时间',]
      ],
      pattern: '%Y-%m-%d %T'
    },
    'last_update_time'
    )
  }

  lock (id, user){
    return new Promise((resolve, reject) => {
      this
      .exec(`SELECT lock_by FROM ${this.table} WHERE id=${id}`)
      .then(result => {
        logger.info('articleMetaTable lock 43', result)
        if(this._isValidArray(result)){
          const lock_by = result[0].lock_by
          if(lock_by){
            resolve({lock_by})
          }else{
            this
            .exec(`UPDATE ${this.table} set lock_by='${user}' where id=${id}`)
            .then(result => {
              resolve()
            })
            .catch(({message}) => reject(message))
          }
        }else{
          reject()
        }

      })
      .catch(({message}) => reject(message))

    })
  }

  release (id, user){
    return new Promise((resolve, reject) => {
      this
      .exec(`UPDATE ${this.table} set lock_by='' where id=${id} and lock_by='${user}'`)
      .then(result => {
        resolve()
      })
      .catch(({message}) => reject(message))
    })
  }
  all (id, user) {
    // logger.info('articleMetaTable all exec id is ', id)
    return new Promise((resolve, reject) => {
      try {
        const batch = []
        logger.info('articleMetaTable 58', user)
        batch.push(this.exec(`
          SELECT
            a.*,
            c.content AS text,
            g.hints AS gift,
            g.used_for_gift AS used_for_gift,
            k.keywords AS keywords,
            k.used_for_search AS used_for_search
          FROM
            article_meta AS a
          LEFT JOIN
            article_content AS c
          ON
            a.id = c.aid
          LEFT JOIN
            article_gift_hint AS g
          ON
            a.id = g.aid
          LEFT JOIN
            article_keywords AS k
          ON
            a.id = k.aid
          WHERE
            a.id = ${id}
          `
        ))
        batch.push(imageTable.exec(`SELECT ${imageTable.columnsStr} FROM ${imageTable.table} WHERE aid=${id}`))
        // 只有当lock_by 没有值时，才可以被UPDATE
        batch.push(this.exec(`UPDATE ${this.table} set lock_by='${user}' where id=${id} and lock_by=''`))
        Promise.all(batch)
        .then(res => {
          logger.info('articleMetaTable 89:', res)
          // logger.info('articleMetaTable 73:', res.length)
          let ret = res[0][0]
          if(ret){
            ret.images = res[1]
            // logger.info('articleMetaTable 76:', ret)
            resolve(ret)
          }else{
            logger.info('articleMetaTable 96:', 'ret不存在。。。。。。。')
            resolve({})
          }
        })
        .catch(err => {
          // logger.info('articleMetaTable 80:', err)
          reject(err.message)
        })
      } catch (e) {
        reject(e.message)
      }
    })
  }

  _isValidArray(arr){
    return arr && Array.isArray(arr) && arr.length > 0
  }

  updateAll (param) {
      return new Promise((resolve, reject) => {
        try {
          // TODO: 数据保存逻辑
          // logger.info('articleMetaTable 40:', param)
          const {id, meta, images, content, gift, keywords, tags} = param
          const batch = []
          logger.info('articleMetaTable 100', meta)
          batch.push(this.exec(`UPDATE ${this.table} SET ? WHERE id=${id}`, meta))
          batch.push(this.exec(
            `
            INSERT INTO
              ${articleContentTable.table} (${articleContentTable.columnsStr})
            VALUES
              (${id}, '${content}')
            ON DUPLICATE KEY
            UPDATE
              content = '${content}'
            `
          ))

          if(this._isValidArray(images)){
            // tid url type origin_filename extension_name size width height


            // const bulks = []
            // let cols = Object.keys(images[0])
            // logger.info('articleMetaTable 58:', cols);
            // for(const image of images){
            //   bulks.push(_.values(image))
            // }
            // // TODO:这块儿需要修改，由于是异步的，
            // // 不能执行先删后插的操作，删除可能在插入之后执行
            // // 不要信任异步操作的顺序
            // batch.push(this.exec(`DELETE FROM ${imageTable.table} where aid=${id}`))
            // logger.info('articleMetaTable 124', cols)
            // batch.push(this.exec(`INSERT INTO ${imageTable.table} (${cols}) VALUES ?`, [bulks]))


            // batch.push(this.exec(`INSERT INTO ${imageTable.table} (aid,url,type,used,origin_filename,extension_name,size,width,height) VALUES ?`, [bulks]))
            // 需要根据上传的image是否有id来确定是update或insert
            logger.info('articleMetaTable 133', images)
            for(const image of images) {
              // 如果图片没有任何修改，就无需执行任何sql
              // if(!image.isModify) continue;
              delete image.isModify
              const {id} = image
              let imageSQL = `UPDATE ${imageTable.table} SET used=${image.used}, type='${image.type}' WHERE id=${id}`
              if(!id){
                delete image.id
                imageSQL = `INSERT ${imageTable.table} SET ?`
              }
              logger.info('articleMetaTable 143:', imageSQL)
              batch.push(this.exec(imageSQL, image))
            }
          }

          // 插入关键词表 DONE
          if(!_.isEmpty(keywords)){
            batch.push(this.exec(`
              INSERT INTO
                article_keywords (aid,used_for_search,keywords)
              VALUES
                (${id},${keywords.used_for_search},'${keywords.keywords}')
              ON DUPLICATE KEY
              UPDATE
                used_for_search = ${keywords.used_for_search}, keywords = '${keywords.keywords}'`
            ))
          }

          // 插入礼物表 DONE
          if(!_.isEmpty(gift)){
            batch.push(this.exec(`
              INSERT INTO
                article_gift_hint (aid,used_for_gift,hints)
              VALUES
                (${id},${gift.used_for_gift},'${gift.hints}')
              ON DUPLICATE KEY UPDATE
                used_for_gift=${gift.used_for_gift}, hints = '${gift.hints}'
            `))
          }

          if(!_.isEmpty(tags)){
            batch.push()
          }

          Promise.all(batch)
          .then(res => {
            // logger.info('articleMetaTable 47:', res)
            resolve()
          })
          .catch(err => {
            // logger.info('articleMetaTable 51:', err)
            reject(err.message)
          })
        } catch (e) {
            reject(e.message)
        }

      })
  }

  /**
   * title[String] 要查询的title
   * orderBy[String] 排序字符串，如：order by last_update_time
   * pagination[Object] 分页参数，如：{offset:0, limit: 50}
   * isLike[Boolean] 是否是分页查询
   */
  getByTitle (title, orderBy, pagination, isLike) {
    let where = ` WHERE title = '${title}' `
    if(isLike){
      where = ` WHERE title like '%${title}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    let sql =  `SELECT ${this.columnsStr} FROM ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total(where).then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(({message}) => reject(message))
          })
          .catch(({message}) => reject(message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(({message}) => reject(message))
      }
    })
  }

  getByMonth (month, orderBy, pagination) {
      orderBy = orderBy || this._getOrderBy(orderBy)
      let limit = this._getPagination(pagination)
      let where = ` WHERE DATE_FORMAT('${month}', '%Y%m') = DATE_FORMAT(${this.orderByCol}, '%Y%m') `
      let sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
      return new Promise((resolve, reject) => {
          super.total(where).then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             }).catch(({message}) => reject(message))
          }).catch(({message}) => reject(message))
      })
  }

  getStatisticsByMonthly () {
    return new Promise((resolve, reject) => {
      // {
      //   year: 2017,
      //   count: 500,
      //   months: [{
      //     month: 1,
      //     count: 200
      //   },{
      //     month: 2,
      //     count: 100
      //   },{
      //     month: 2,
      //     count: 200
      //   }]
      // }
      const sql = `
      SELECT
        CONVERT(DATE_FORMAT(last_update_time, '%Y'), SIGNED) AS year,
        CONVERT(DATE_FORMAT(last_update_time, '%m'), SIGNED) AS month,
        COUNT(id) AS count
      FROM
        ${this.table}
      GROUP BY
        year, month
      ORDER BY
        year DESC,
        month DESC
      `
      super.exec(sql)
      .then(res => {
        let ret = []
        // res = [{year: '2014', month: '10', count: 1 }, { year: '2014', month: '12', count: 1}, ...]
        // ret = [{year: '2014', months:[{month:'10', count: 1},{month:'12', count:1}]}, ...]
        if(res && Array.isArray(res)){
          res.map(row => {
            const {year, month, count} = row
            const yearIndex = _.findIndex(ret, y => y.year === year)
            const hasYear = yearIndex > -1
            const monthData = {month, count}
            if(hasYear){
              const months = ret[yearIndex].months
              if(months && months.length) {
                ret[yearIndex].months.push(monthData)
              }else{
                ret[yearIndex].months = [monthData]
              }
              ret[yearIndex].count += count
            }else{
              ret.push({year, count , months:[monthData]})
            }
          })
        }
        resolve(ret)
      })
      .catch(({message}) => reject(message))
    })
  }

  create (param) {
    return new Promise((resolve, reject) => {
      super.create(param).then(result => {
        resolve({id: result.insertId})
      })
      .catch(({message}) => reject(message))
    })
  }

  getAll(orderBy, limit){
    return new Promise((resolve, reject) => {
      if(limit){
        super.total().then(countRes => {
             super.getAll(orderBy, limit).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             }).catch(({message}) => reject(message))
          }).catch(({message}) => reject(message))
      }else{
        super.getAll(orderBy, limit)
        .then(result => {
          resolve({
            articles: result
          })
        }).catch(({message}) => reject(message))
      }
    })
  }

  getById (id) {
    return new Promise((resolve, reject) => {
      super.getById(id).then(result => {
        resolve({
          articles: result,
          total: result.length
        })
      })
      .catch(({message}) => reject(message))
    })
  }


  getByCtype (ctype, orderBy, pagination){
    let where = ` where ctype = '${ctype}' `
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total(where).then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(({message}) => reject(message))
          })
          .catch(({message}) => reject(message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(({message}) => reject(message))
      }
    })
  }

  getByUser (user, orderBy, pagination, isLike) {
    let where = ` where user = '${user}' `
    if(isLike){
      where = ` where user like '%${user}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total(where).then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(({message}) => reject(message))
          })
          .catch(({message}) => reject(message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(({message}) => reject(message))
      }
    })
  }

  getByAuthor (author, orderBy, pagination, isLike) {
    let where = ` where author = '${author}' `
    if(isLike){
      where = ` where author like '%${author}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total(where).then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(({message}) => reject(message))
          })
          .catch(({message}) => reject(message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(({message}) => reject(message))
      }
    })
  }
  /**
   * TODO: 传入的time为 timestamp
   */
  getByTime (time, orderBy, pagination){
    let where = ` where time = '${time}' `
    if(isLike){
      where = ` where time like '%${time}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql =  `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if(limit){
        super.total(where).then(countRes => {
             super.exec(sql).then(result => {
               resolve({
                 total: countRes[0].count,
                 articles: result
               })
             })
             .catch(({message}) => reject(message))
          })
          .catch(({message}) => reject(message))
      }else{
        super.exec(sql).then(result => {
          resolve({
            articles: result
          })
        })
        .catch(({message}) => reject(message))
      }
    })
  }

  _getOrderBy (orderBy) {
    orderBy = orderBy || ''
    if(!orderBy){
      orderBy = ` order by ${this.orderByCol} desc `
    }
    return orderBy
  }

  _getPagination (pagination){
    let limit = ''
    if(pagination && !_.isEmpty(pagination)){
      limit = ` limit ${pagination.offset}, ${pagination.limit} `
    }
    return limit
  }
  // getByTitle (title) {
  //   return super.getByCond(`title = ${title}`)
  // }
  // deleteByName (name) {
  //   return super.deleteByCond(`name = ${name}`)
  // }
  // save(data){
  //   // 新增时，如果没有指定 lock_by 和 last_update_by，则默认这两个字段和 author 一样
  //   const author = data.author
  //   const lock_by = data.lock_by
  //   const last_update_by = data.last_update_by
  //   if(!lock_by){
  //     data.lock_by = author
  //   }
  //   if(!last_update_by){
  //     data.last_update_by = author
  //   }
  //   return super.save(data)
  // }
}

module.exports = ArticleMetaTable
