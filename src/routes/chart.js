import screenshot from '../lib/screenshot'
import { fetchStockData } from '../lib/stock'

const handleLiveChart = (bot) => {
  bot.onText(/\/chart (.*)/, async (msg, match) => {
    const chatId = msg.chat.id
    const stockId = match[1]

    if (!/^[0-9_A-Z]+$/.test(stockId)) {
      return bot.sendMessage(chatId, '請輸入有效股號\ne.g. `/chart 2330`', {
        parse_mode: 'Markdown'
      })
    }

    const { name } = await fetchStockData(stockId)
    if (!name) {
      return bot.sendMessage(chatId, `查無 ${stockId}，請確認此股票已上市/櫃`)
    }

    const processId = await bot.sendLoadingMsg(chatId)
    const chartBuffer = await screenshot(stockId)
    bot.sendPhoto(chatId, chartBuffer)
    bot.deleteMessage(chatId, processId)
  })

  bot.onText(/\/chart$/, (msg) => {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, '請帶入股號\ne.g. `/chart 2330`', {
      parse_mode: 'Markdown'
    })
  })

  bot.onText(/\/chart_(otc|tse)$/, async (msg, match) => {
    const chatId = msg.chat.id
    const type = match[1].toUpperCase()
    const processId = await bot.sendLoadingMsg(chatId)
    const chartBuffer = await screenshot(type)
    bot.sendPhoto(chatId, chartBuffer)
    bot.deleteMessage(chatId, processId)
  })
}

export default handleLiveChart
