const axios = require('axios')

async function fetch() {
  const { data } = await axios.get(
    'https://www.binance.com/bapi/earn/v1/friendly/pos/dc/underlying/overview',
    {
      params: {
        isMatchUserAsset: false,
        uiMode: 'PRO_MODE',
      },
    }
  )

  return data.data.list.map(item => ({
    token: item.asset,
    apy: (+item.maxApr * 100).toFixed(2),
  }))
}

module.exports = {
  fetch,
}
