import TelegramBot from 'node-telegram-bot-api'
import { botToken } from '../../config'
import { handleCallbackQuery } from '../handlers/callbackQuery'
import { handleInlineQuery } from '../handlers/inlineQuery'

const bot = new TelegramBot(botToken, {
  polling: true
})

bot.route = (routeConfig) => {
  Object.entries(routeConfig).forEach(([regex, handler]) => {
    bot.onText(new RegExp(regex), handler.bind(bot))
  })
}

bot.on('callback_query', handleCallbackQuery.bind(bot))
bot.on('inline_query', handleInlineQuery.bind(bot))

bot.sendLoadingMsg = async (chatId) => {
  const { message_id } = await bot.sendMessage(chatId, '處理中，請稍候...', {
    disable_notification: true
  })

  return message_id
}

bot.sendStockIdNotFoundError = (chatId, stockId) => {
  bot.sendMessage(chatId, `查無 ${stockId}，請確認此股票已上市/櫃`)
}

export default bot
