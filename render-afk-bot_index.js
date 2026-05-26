const mineflayer = require('mineflayer');
const express = require('express');

// 1. Веб-сервер для удержания Render в онлайне 24/7
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1>АФК Бот Активен!</h1><p>Сервер удерживается в облаке Render.</p>');
});

app.listen(PORT, () => {
    console.log(`[Web Server] Запущен на порту ${PORT}`);
});

// 2. Настройки подключения к Майнкрафт серверу
const botOptions = {
    host: 'WeAreSmoFun.aternos.me', // Твой айпи Атернос
    port: 13795,                     // Стандартный порт
    username: 'AFK_Bot',             // Ник бота в игре
    version: 1.21.1                   // Автоматический выбор версии
};

function createBot() {
    console.log('[Minecraft] Попытка подключения к Атернос...');
    const bot = mineflayer.createBot(botOptions);

    // Бот успешно зашел на сервер
    bot.on('spawn', () => {
        console.log(`[Minecraft] Успех! Бот ${bot.username} зашел на сервер.`);
        
        // Каждые 4 минуты прыгаем, чтобы Атернос не кикнул за АФК
        if (global.jumpInterval) clearInterval(global.jumpInterval);
        global.jumpInterval = setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log('[Minecraft] Бот подпрыгнул для предотвращения кика.');
            }
        }, 240000);
    });

    // Если бота кикнуло или сервер отключился
    bot.on('end', (reason) => {
        console.log(`[Minecraft] Бот отключился. Причина: ${reason}`);
        if (global.jumpInterval) clearInterval(global.jumpInterval);
        
        console.log('[Minecraft] Переподключение через 1 минуту...');
        setTimeout(createBot, 60000); 
    });

    // Ошибки соединения
    bot.on('error', (err) => {
        console.log(`[Error] Произошла ошибка: ${err.message}`);
    });
}

// Запуск бота
createBot();
