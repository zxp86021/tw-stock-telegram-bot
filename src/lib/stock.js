import fetch from 'isomorphic-fetch'
import { rawUrl } from '../../config'

export const parseRaw = (res) => {
  try {
    return JSON.parse(
      res
        .match(/({.*})/)[1]
        .replace(/:\s?((?:-)?[0-9.]+)[,}]/g, (m, t) => m.replace(t, `"${t}"`))
    )
  } catch {
    return null
  }
}

export const stockDataNormalizer = (data) => {
  const { mem = {}, id: stockId } = data || {}
  const name = mem.name

  if (!name) {
    return {}
  }

  const currentPrice = mem[125]
  const risePrice = (mem[184] >= 0 ? '+' : '') + mem[184]
  const risePricePerc =
    (mem[185] >= 0 ? '+' : '') + (+mem[185]).toFixed(2).toString() + '%'
  const amount = mem[404]
  const sellAmount = mem[645]
  const buyAmount = mem[646]
  const maxPrice = mem[130]
  const minPrice = mem[131]
  const openPrice = mem[126]
  const lastPrice = mem[129]
  const turnover = (mem[423] / 100).toFixed(2).toString()
  let ticks = [
    [mem[101] > 100000 ? '市價' : mem[101], mem[113]],
    [mem[102], mem[114]],
    [mem[103], mem[115]],
    [mem[104], mem[116]],
    [mem[105], mem[117]],
    [mem[106], mem[118]],
    [mem[107], mem[119]],
    [mem[108], mem[120]],
    [mem[109], mem[121]],
    [mem[110], mem[122]]
  ] // [[price, amount]]

  ticks = ticks.map((tick) => {
    return [tick[0] || '', tick[1] || '']
  })

  return {
    stockId,
    name,
    currentPrice,
    risePrice,
    risePricePerc,
    amount,
    sellAmount,
    buyAmount,
    maxPrice,
    minPrice,
    openPrice,
    lastPrice,
    turnover,
    ticks
  }
}

export const fetchStockData = async (stockId) => {
  const res = await fetch(rawUrl.replace('STOCK_ID', stockId)).then((res) =>
    res.text()
  )
  const parsedRes = parseRaw(res)
  const result = stockDataNormalizer(parsedRes)

  if (!result.name) {
    return {}
  }

  return result
}
