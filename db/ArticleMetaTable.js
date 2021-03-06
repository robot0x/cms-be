const _ = require('lodash')
const Table = require('./Table')
const ImageTable = require('./ImageTable')
const imageTable = new ImageTable()
const UserTable = require('./UserTable')
const userTable = new UserTable()
const ArticleContentTable = require('./ArticleContentTable')
const articleContentTable = new ArticleContentTable()
const TagIndexTable = require('./TagIndexTable')
const tagIndexTable = new TagIndexTable()
const Utils = require('../utils/Utils')
const Log = require('../utils/Log')

class ArticleMetaTable extends Table {
  constructor () {
    super(
      'diaodiao_article_meta',
      [
        `id`, // int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
        `title`, // varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '文章title，title不做任何处理，内部有换行和空格不要管',
        `share_title`, // varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享出去的文章的title',
        `wx_title`, // varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享到微信的文章的title',
        `wb_title`, // varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享到微博的文章的title',
        `ctype`, // tinyint(1) unsigned DEFAULT 0 COMMENT '文章类型：1-首页/2-好物/3-专刊/4-活动/5-经验/7-值得买/8-评测/9-专题',
        `titleex`, // varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '专刊专用。在专刊上显示 七个好物、八种经验之类的',
        `titlecolor`, // int(32) unsigned DEFAULT 0 COMMENT '专刊专用。用来指定标题颜色',
        `buylink`, // varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '分享出去的文章的title',
        `timetopublish`, // int(10) unsigned DEFAULT 0 COMMENT '定时发布。格式是UNIX时间戳',
        `price`, // varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '价格串。形如：越￥360',
        `status`, // tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '当前文章状态: 0-新增的文章/1-已发布/2-未发布',
        `create_time`, // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
        `last_update_time`, // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON update CURRENT_TIMESTAMP COMMENT '文章最后更新时间',
        `user`, // varchar(60) DEFAULT '' COMMENT '文章被那个用户所创建',
        `lock_by`, // varchar(60) DEFAULT '' COMMENT '被那个用户锁定',
        `last_update_by`, // varchar(60) DEFAULT '' COMMENT '最后一次更新的用户',
        `author` // varchar(60) DEFAULT '' COMMENT '文章作者姓名',
      ],
      {
        columns: [
          'create_time', // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '文章创建时间',
          'last_update_time' // timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON update CURRENT_TIMESTAMP COMMENT '文章最后更新时间',]
        ],
        pattern: '%Y-%m-%d %T'
      },
      'last_update_time'
    )
  }

  async lock (id, token) {
    console.log('lock.token: ', token)
    try {
      let lockByMeta = await this.exec(`SELECT lock_by FROM ${this.table} WHERE id=${id}`)
      if (Utils.isValidArray(lockByMeta)) {
        const { lock_by } = lockByMeta[0]
        // 如果已经被锁定了，则直接返回被锁定着的名字
        if (lock_by) {
          return { lock_by }
        } else {
          let username = await userTable.tokenToUsername(token)
          if (username) {
            await this.exec(`UPDATE ${this.table} SET lock_by='${username}' WHERE id=${id}`)
          } else {
            return {
              status: 401,
              server_timestamp: Date.now(),
              message: `Unauthorized: Invalid token ${token}`
            }
          }
        }
      }
    } catch (error) {
      console.log(error)
      Log.exception(error)
    }
    // return new Promise((resolve, reject) => {
    //   this.exec(`SELECT lock_by FROM ${this.table} WHERE id=${id}`)
    //     .then(result => {
    //       console.log('articleMetaTable lock 43', result)
    //       if (Utils.isValidArray(result)) {
    //         const { lock_by } = result[0]
    //         if (lock_by) {
    //           resolve({
    //             lock_by
    //           })
    //         } else {
    //           this.exec(
    //             `update ${this.table} set lock_by='${user}' where id=${id}`
    //           )
    //             .then(result => {
    //               resolve()
    //             })
    //             .catch(err => {
    //               Log.exception(err)
    //               reject(err.message)
    //             })
    //         }
    //       } else {
    //         reject()
    //       }
    //     })
    //     .catch(err => {
    //       Log.exception(err)
    //       reject(err.message)
    //     })
    // })
  }

  async release (id, token) {
    try {
      let username = await userTable.tokenToUsername(token)
      if (username) {
        await this.exec(`UPDATE ${this.table} set lock_by='' where id=${id} and lock_by='${username}'`)
      } else {
        return {
          status: 401,
          server_timestamp: Date.now(),
          message: `Unauthorized: Invalid token ${token}`
        }
      }
    } catch (error) {
      Log.exception(error)
      console.log(error)
    }
    // return new Promise((resolve, reject) => {
    //   this.exec(
    //     `UPDATE ${this.table} set lock_by='' where id=${id} and lock_by='${user}'`
    //   )
    //     .then(result => {
    //       resolve()
    //     })
    //     .catch(err => {
    //       Log.exception(err)
    //       reject(err.message)
    //     })
    // })
  }
  /**
   * @param {number} id
   * @param {string} user
   * @returns promise
   *
   * @memberof ArticleMetaTable
   * 前端Edit.vue中，点击“清空缓存”，或第一次加载数据，会执行这个方法
   */
  all (id, user) {
    // console.log('articleMetaTable all exec id is ', id)
    return new Promise((resolve, reject) => {
      try {
        const batch = []
        console.log('articleMetaTable 58', user)
        // res[0]
        batch.push(
          this.exec(
            `
          SELECT
            a.*,
            c.content AS text,
            g.hints AS gift,
            g.used_for_gift AS used_for_gift,
            k.keywords AS keywords,
            k.used_for_search AS used_for_search
          FROM
            diaodiao_article_meta AS a
          LEFT JOIN
            diaodiao_article_content AS c
          ON
            a.id = c.aid
          LEFT JOIN
            diaodiao_article_gift_hint_v2 AS g
          ON
            a.id = g.aid
          LEFT JOIN
            diaodiao_article_keywords AS k
          ON
            a.id = k.aid
          WHERE
            a.id = ${id}
          `
          )
        )
        // res[1]
        batch.push(
          imageTable.exec(
            `SELECT ${imageTable.columnsStr} FROM ${imageTable.table} WHERE aid=${id}`
          )
        )
        // res[2]
        batch.push(
          tagIndexTable.getById(id)
        )
        // res[3]
        // 只有当 lock_by 没有值时，才可以被UPDATE
        batch.push(
          this.exec(
            `UPDATE ${this.table} set lock_by='${user}' where id=${id} and lock_by=''`
          )
        )
        Promise.all(batch)
          .then(res => {
            // console.log('articleMetaTable 89:', res)
            // console.log('articleMetaTable 73:', res.length)
            let [[ret]] = res
            if (ret) {
              ret.images = res[1]
              ret.tags = res[2]
              // console.log('articleMetaTable 76:', ret)
              resolve(ret)
            } else {
              // console.log('articleMetaTable 96:', 'ret不存在。。。。。。。')
              resolve({})
            }
          })
          .catch(err => {
            // console.log('articleMetaTable 80:', err)
            Log.exception(err)
            reject(err.message)
          })
      } catch (e) {
        Log.exception(e)
        reject(e.message)
      }
    })
  }

  /**
   * @param {object} param
   * @returns promise
   * @memberof ArticleMetaTable
   * 在Edit.vue中，点击“保存”执行该方法
   */
  updateAll (param) {
    return new Promise(async (resolve, reject) => {
      try {
        // TODO: 数据保存逻辑
        // console.log('articleMetaTable 40:', param)
        let { id, meta, images, content, gift, keywords, tags } = param
        console.log('[updateAll]接收到的参数为：', param)
        console.log('[updateAll]要保存的图片为：', images)
        const batch = []
        // console.log('articleMetaTable 100', param)
        batch.push(
          this.exec(`UPDATE ${this.table} SET ? WHERE id=${id}`, meta)
        )
        batch.push(
          this.exec(
            `INSERT INTO
              ${articleContentTable.table} (${articleContentTable.columnsStr})
            VALUES
              (${id}, ${articleContentTable.escape(content)})
            ON DUPLICATE KEY
            UPDATE
              content = ${articleContentTable.escape(content)}`
          )
        )
        let [rs] = await this.exec(`SELECT count(id) AS count FROM ${imageTable.table} where aid=${id}`)
        if (Utils.isValidArray(images) && (images.some(image => image.isModify === 1) || rs.count !== images.length)) {
          // 先删除，后插入
          await this.exec(`DELETE FROM ${imageTable.table} where aid=${id}`)
          console.log('[updateAll]要保存的图片为：', images)
          // let imageIds = []
          // `aid`, // int(11) unsigned NOT NULL COMMENT '文章的id',
          // `url`, // varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '图片url',
          // `used`, // tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否被使用。0-未被使用/1-被使用',
          // `type`, // smallint unsigned COMMENT '图片的类型。''0未设置类型（没有被使用/第1位-内容图(1)/第2位cover图(2)/第3位coverex图(4)/第4位thumb图(8)/第5位swipe图(16)/第6位banner图(32)',
          // `origin_filename`, // varchar(32) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '上传时的文件名',
          // `extension_name`, // varchar(10) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片扩展名，jpg/jpeg/png/gif...',
          // `size`, // int unsigned NOT NULL DEFAULT 0 COMMENT '图片尺寸。单位为byte',
          // `width`, // smallint(4) unsigned NOT NULL DEFAULT 0 COMMENT '上传时的原始宽度。单位为px',
          // `height`, // smallint(4) unsigned NOT NULL DEFAULT 0 COMMENT '上传时的原始高度。单位为px',
          // `alt`, // varchar(32) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'img的alt属性',
          // `title`, // varchar(32) DEFAULT '' COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'img的title属性',
          let insertImageSQL = `INSERT INTO ${imageTable.table}(aid,url,used,type,origin_filename,extension_name,size,width,height,alt,title) VALUES`
          const insertImageSQLValues = []
          for (const image of images) {
            let {url, used, type, origin_filename, extension_name, size, width, height, alt, title} = image
            insertImageSQLValues.push(
              `(${id}, ${imageTable.escape(Utils.removeProtocolHead(url))}, ${used}, ${type || 0}, ${imageTable.escape(origin_filename)}, ${imageTable.escape(extension_name)}, ${size}, ${width}, ${height}, ${imageTable.escape(alt || '')}, ${imageTable.escape(title || '')})`
            )
          }
          insertImageSQL = insertImageSQL + insertImageSQLValues.join(',')
          console.log('insertImageSQL:', insertImageSQL)
          batch.push(this.exec(insertImageSQL))
        }
        // if (Utils.isValidArray(images)) {
        //   // tid url type origin_filename extension_name size width height
        //   // const bulks = []
        //   // let cols = Object.keys(images[0])
        //   // console.log('articleMetaTable 58:', cols);
        //   // for(const image of images){
        //   //   bulks.push(_.values(image))
        //   // }
        //   // TODO:这块儿需要修改，由于是异步的，
        //   // 不能执行先删后插的操作，删除可能在插入之后执行
        //   // 不要信任异步操作的顺序
        //   // batch.push(this.exec(`DELETE FROM ${imageTable.table} where aid=${id}`))
        //   // console.log('articleMetaTable 124', cols)
        //   // batch.push(this.exec(`INSERT INTO ${imageTable.table} (${cols}) VALUES ?`, [bulks]))
        //   // batch.push(this.exec(`INSERT INTO ${imageTable.table} (aid,url,type,used,origin_filename,extension_name,size,width,height) VALUES ?`, [bulks]))
        //   // 需要根据上传的image是否有id来确定是UPDATE或INSERT
        //   console.log('[updateAll]要保存的图片为：', images)
        //   // let imageIds = []
        //   for (const image of images) {
        //     console.log('[updateAll]进入循环....')
        //     const { id } = image
        //     if (id) {
        //       // imageIds.push(id)
        //       if (!image.isModify) continue
        //     }
        //     // 如果图片不是新上传的且没有任何修改，就无需执行任何sql
        //     delete image.isModify
        //     let imageSQL = `UPDATE ${imageTable.table} SET used=${image.used}, type='${image.type}' WHERE id=${id}`
        //     if (!id) {
        //       delete image.id
        //       // remove掉协议头
        //       image.url = Utils.removeProtocolHead(image.url)
        //       imageSQL = `INSERT ${imageTable.table} SET ?`
        //     }
        //     console.log('[updateAll]图片的sql语句为：', imageSQL)
        //     batch.push(this.exec(imageSQL, image))
        //   }
        //   // // 如果在界面上删除了图片，则需要把数据库中的数据也一同删除掉
        //   // if (imageIds.length > 0) {
        //   //   // let deleteImageSQL = `DELETE FROM ${imageTable.table} WHERE id NOT IN (${imageIds.join(',')})`
        //   //   // 发现了一个大BUG，删除了其他文章的图片，数据库中将近100万张图片被我删除光了
        //   //   let deleteImageSQL = `DELETE FROM ${imageTable.table} WHERE aid = ${id} AND id NOT IN (${imageIds.join(',')})`
        //   //   console.log('deleteImageSQL:', deleteImageSQL)
        //   //   batch.push(this.exec(deleteImageSQL))
        //   // }
        // }

        /**
         * 2017-06-07 先下掉关键词、tag、gift
         * 因为还没有测试。。关键词、tag、gift操作在老CMS系统中进行即可
         * 上线时，解开注释....
         * 测试通过 ...
         */
        // 插入关键词表 DONE
        if (!_.isEmpty(keywords)) {
          let {used_for_search} = keywords
          keywords = keywords.keywords
          const DEFAULT_NULL_KEY = {category: '', brand: '', similar: '', scene: '', special: ''}
          if (_.isEmpty(keywords)) {
            keywords = DEFAULT_NULL_KEY
          } else {
            let keyObj = JSON.parse(keywords)
            // 处理一下不可见字符
            Object.keys(keyObj).forEach(ke => {
              let val = keyObj[ke]
              if (!val) return
              // 两边trim之后，在去掉控制字符，然后用空格隔开每个keyword
              keyObj[ke] = val.split(/\s/).map(v => Utils.removeInvilidChar(v)).join(' ')
            })
            keywords = Object.assign(DEFAULT_NULL_KEY, keyObj)
            console.log('[updateAll] keywords:', keywords)
          }
          // 一定要注意操作keyword表要小心，会影响线上搜索
          // 如果keywords字段为空，则用默认的json代替，否则的话搜索会挂
          let key = JSON.stringify(keywords)
          batch.push(
            this.exec(
              `
              INSERT INTO
                diaodiao_article_keywords (aid,used_for_search,keywords)
              VALUES
                (${id},${used_for_search},${this.escape(key)})
              ON DUPLICATE KEY
              UPDATE
                used_for_search = ${used_for_search}, keywords = ${this.escape(key)}`
            )
          )
        }
        /**
         * 插入礼物表 DONE
         * 测试通过...
         */
        if (!_.isEmpty(gift)) {
          const DEFAULT_NULL_KEY = {character: '', relation: '', scene: ''}
          // gift是特殊搜索，所以字段名字也叫used_for_search
          // {"relation": "", "interest": "", "gender": "", "relation_level": "", "age": "", "character": "", "can_as_gift": "0", "scene": ""}
          let {hints, used_for_gift} = gift
          if (_.isEmpty(hints)) {
            hints = DEFAULT_NULL_KEY
          } else {
            hints = Object.assign(DEFAULT_NULL_KEY, JSON.parse(hints))
          }
          hints = JSON.stringify(hints)
          batch.push(
            this.exec(
              `
              INSERT INTO
                diaodiao_article_gift_hint_v2 (aid,used_for_gift,hints)
              VALUES
                (${id},${used_for_gift},'${hints}')
              ON DUPLICATE KEY UPDATE
                used_for_gift=${used_for_gift}, hints = '${hints}'
            `
            )
          )
        }
        // 先删后插 测试通过 ...
        this.exec(`DELETE FROM diaodiao_article_tag_index WHERE aid = ${id}`).then(() => {
          let { ctype } = meta
          let tagInsertSql = `INSERT INTO diaodiao_article_tag_index (aid,tag1,tag2) VALUES `
          let values = [`(${id},'page_type','${Utils.ctypeToType(ctype)}')`]
          if (!_.isEmpty(tags)) {
            for (let t of tags) {
              values.push(`(${id},'${t.tag1}','${t.tag2}')`)
            }
          }
          tagInsertSql += values.join(',')
          Log.business(tagInsertSql)
          batch.push(this.exec(tagInsertSql))
        })

        Promise.all(batch)
          .then(res => {
            resolve()
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } catch (e) {
        Log.exception(e)
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
    if (isLike) {
      where = ` WHERE title like '%${title}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    let sql = `SELECT ${this.columnsStr} FROM ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total(where)
          .then(countRes => {
            super
              .exec(sql)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  articles: result
                })
              })
              .catch(err => {
                Log.exception(err)
                reject(err.message)
              })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } else {
        super
          .exec(sql)
          .then(result => {
            resolve({
              articles: result
            })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      }
    })
  }

  getByMonth (month, orderBy, pagination) {
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    let where = ` WHERE DATE_FORMAT('${month}', '%Y%m') = DATE_FORMAT(${this.orderByCol}, '%Y%m') `
    let sql = `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      super
        .total(where)
        .then(countRes => {
          super
            .exec(sql)
            .then(result => {
              resolve({
                total: countRes[0].count,
                articles: result
              })
            })
            .catch(err => {
              Log.exception(err)
              reject(err.message)
            })
        })
        .catch(err => {
          Log.exception(err)
          reject(err.message)
        })
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

      // 应该按照 create_time 来进行统计 而不是原来我认为的 last_update_time
      const sql = `
      SELECT
        CONVERT(DATE_FORMAT(create_time, '%Y'), SIGNED) AS year,
        CONVERT(DATE_FORMAT(create_time, '%m'), SIGNED) AS month,
        COUNT(id) AS count
      FROM
        ${this.table}
      GROUP BY
        year, month
      ORDER BY
        year DESC,
        month DESC
      `
      super
        .exec(sql)
        .then(res => {
          let ret = []
          // res = [{year: '2014', month: '10', count: 1 }, { year: '2014', month: '12', count: 1}, ...]
          // ret = [{year: '2014', months:[{month:'10', count: 1},{month:'12', count:1}]}, ...]
          if (res && Array.isArray(res)) {
            res.map(row => {
              const { year, month, count } = row
              const yearIndex = _.findIndex(ret, y => y.year === year)
              const hasYear = yearIndex > -1
              const monthData = {
                month,
                count
              }
              if (hasYear) {
                const months = ret[yearIndex].months
                if (months && months.length) {
                  ret[yearIndex].months.push(monthData)
                } else {
                  ret[yearIndex].months = [monthData]
                }
                ret[yearIndex].count += count
              } else {
                ret.push({
                  year,
                  count,
                  months: [monthData]
                })
              }
            })
          }
          resolve(ret)
        })
        .catch(err => {
          Log.exception(err)
          reject(err.message)
        })
    })
  }

  create (param) {
    return new Promise((resolve, reject) => {
      super
        .create(param)
        .then(result => {
          resolve({
            id: result.insertId
          })
        })
        .catch(err => {
          Log.exception(err)
          reject(err.message)
        })
    })
  }

  getAll (orderBy, limit) {
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total()
          .then(countRes => {
            super
              .getAll(this.orderByCol, limit)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  articles: result
                })
              })
              .catch(err => {
                Log.exception(err)
                reject(err.message)
              })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } else {
        super
          .getAll(orderBy, limit)
          .then(result => {
            resolve({
              articles: result
            })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      }
    })
  }

  getById (id) {
    return new Promise((resolve, reject) => {
      super
        .getById(id)
        .then(result => {
          resolve({
            articles: result,
            total: result.length
          })
        })
        .catch(err => {
          Log.exception(err)
          reject(err.message)
        })
    })
  }

  getByCtype (ctype, orderBy, pagination) {
    let where = ` where ctype = '${ctype}' `
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql = `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total(where)
          .then(countRes => {
            super
              .exec(sql)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  articles: result
                })
              })
              .catch(err => {
                Log.exception(err)
                reject(err.message)
              })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } else {
        super
          .exec(sql)
          .then(result => {
            resolve({
              articles: result
            })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      }
    })
  }

  getByUser (user, orderBy, pagination, isLike) {
    let where = ` where user = '${user}' `
    if (isLike) {
      where = ` where user like '%${user}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql = `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total(where)
          .then(countRes => {
            super
              .exec(sql)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  articles: result
                })
              })
              .catch(err => {
                Log.exception(err)
                reject(err.message)
              })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } else {
        super
          .exec(sql)
          .then(result => {
            resolve({
              articles: result
            })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      }
    })
  }

  getByAuthor (author, orderBy, pagination, isLike) {
    let where = ` where author = '${author}' `
    if (isLike) {
      where = ` where author like '%${author}%' `
    }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql = `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total(where)
          .then(countRes => {
            super
              .exec(sql)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  articles: result
                })
              })
              .catch(err => {
                Log.exception(err)
                reject(err.message)
              })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } else {
        super
          .exec(sql)
          .then(result => {
            resolve({
              articles: result
            })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      }
    })
  }
  /**
   * TODO: 传入的time为 timestamp
   */
  getByTime (time, orderBy, pagination) {
    let where = ` where time = '${time}' `
    // if (isLike) {
    //   where = ` where time like '%${time}%' `
    // }
    orderBy = orderBy || this._getOrderBy(orderBy)
    let limit = this._getPagination(pagination)
    const sql = `SELECT ${this.columnsStr} from ${this.table} ${where} ${orderBy} ${limit} `
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total(where)
          .then(countRes => {
            super
              .exec(sql)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  articles: result
                })
              })
              .catch(err => {
                Log.exception(err)
                reject(err.message)
              })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      } else {
        super
          .exec(sql)
          .then(result => {
            resolve({
              articles: result
            })
          })
          .catch(err => {
            Log.exception(err)
            reject(err.message)
          })
      }
    })
  }

  _getOrderBy (orderBy) {
    orderBy = orderBy || ''
    if (!orderBy) {
      orderBy = ` order by ${this.orderByCol} desc `
    }
    return orderBy
  }

  _getPagination (pagination) {
    let limit = ''
    if (pagination && !_.isEmpty(pagination)) {
      limit = ` limit ${pagination.offset}, ${pagination.limit} `
    }
    return limit
  }
}

module.exports = ArticleMetaTable
