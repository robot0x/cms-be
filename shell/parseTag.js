#!/usr/local/bin/node
var fs = require('fs')
fs.readFile('./tag_name','utf8', (err, text) => {
  if (err) throw err
  const arr = text.split(/\n/).filter(line => line.trim())
  const inserts = []
  for(const line of arr){
    const attrs = line.split(/ +/).filter(attr => attr && attr.trim())
    const [tid, name, level, title, keywords, description, parent] = attrs
    // console.log(matchs);
    // `tid`
    // `name`
    // `level`
    // `title`
    // `keywords`
    // `description`
    // `parent`
    inserts.push(`insert article_tag_name set tid=${tid},name='${name}',level=${level},parent = ${parent || 'NULL'},keywords='${keywords}',description='${description}';`)
  }

  fs.writeFile('./mysql/article_tag_name_insert.sql', inserts.join('\n'), 'utf8', err => {
    console.log(err)
  })
})
