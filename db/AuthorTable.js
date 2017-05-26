const Table = require('./Table')
const Log = require('../utils/Log')

class AuthorTable extends Table {
  constructor () {
    super(
      'diaodiao_author',
      [
        'id',
        'source',
        'pic_uri',
        'title',
        'intro',
        'type',
        'link',
        'naming',
        'value',
        'brief'
      ],
      '',
      'id'
    )
  }
  getAll (orderBy, limit) {
    return new Promise((resolve, reject) => {
      if (limit) {
        super
          .total()
          .then(countRes => {
            super
              .getAll(null, limit)
              .then(result => {
                resolve({
                  total: countRes[0].count,
                  authors: result
                })
              })
              .catch(err => {
                reject(err)
                Log.exception(err)
              })
          })
          .catch(err => {
            reject(err)
            Log.exception(err)
          })
      } else {
        super
          .getAll(null, limit)
          .then(result => {
            resolve({
              authors: result
            })
          })
          .catch(err => {
            reject(err)
            Log.exception(err)
          })
      }
    })
  }

  update (param) {
    return new Promise((resolve, reject) => {
      const { id } = param
      delete param.id
      return super
        .exec(`UPDATE ${this.table} SET ? WHERE id=${id}`, param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
          Log.exception(err)
        })
    })
  }
}

module.exports = AuthorTable
