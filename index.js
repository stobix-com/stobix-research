require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { CronJob } = require('cron')
const binance = require('./apis/binance')
const okx = require('./apis/okx')

function writeJSON(dir, filename, data) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.resolve(dir, filename), JSON.stringify(data, null, 2))
}

function sortByTokenName(array) {
  return array.sort((a, b) => a.token.localeCompare(b.token, 'en', { sensitivity: 'base' }))
}

new CronJob(
  '0 10 * * *',
  async function execute() {
    const date = new Date().toISOString()
    const prefix = date.slice(0, 16).replace(':', '-').replace('T', '_')

    console.log(`[${date}] Fetching data...`)

    const data = await Promise.all([binance.fetch(), okx.fetch()])

    writeJSON(path.resolve('data', 'binance'), `${prefix}.json`, {
      date,
      exchange: 'Binance',
      data: sortByTokenName(data[0]),
    })

    writeJSON(path.resolve('data', 'okx'), `${prefix}.json`, {
      date,
      exchange: 'OKX',
      data: sortByTokenName(data[1]),
    })

    console.log(`[${date}] Saved data!`)
  },
  null,
  true,
  'GMT',
  null,
  true
)
