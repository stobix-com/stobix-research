const axios = require('axios')

async function fetch() {
  const { data } = await axios.get('https://www.okx.com/priapi/v2/sfp/dcd/currency-pair', {
    params: {
      containQuote: true,
      t: Date.now(),
    },
    headers: {
      'x-site-info': process.env.OKX_SITE_INFO,
    },
  })

  return data.data.currencyPairs.map(pair => ({
    token: pair.notionalCurrency,
    apy: pair.rate?.rateNum?.value?.[1]?.toFixed(2),
  }))
}

module.exports = {
  fetch,
}
