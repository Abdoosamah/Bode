const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');

// إعداد عميل OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // سيتم جلب المفتاح من متغيرات البيئة
});

// إعداد عميل Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`تم تسجيل الدخول بنجاح كـ ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // تجنب رد البوت على نفسه أو Bot آخر
    if (message.author.bot) return;

    // الرد عند كتابة !gpt في أي روم
    if (message.content.startsWith('!gpt')) {
        const prompt = message.content.slice(4).trim();

        if (!prompt) {
            return message.reply('يرجى كتابة سؤال بعد الأمر `!gpt`');
        }

        try {
            await message.channel.sendTyping();

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
            });

            const reply = response.choices[0].message.content;
            await message.reply(reply);
        } catch (error) {
            console.error('حدث خطأ:', error);
            await message.reply('حدث خطأ أثناء الاتصال بـ OpenAI.');
        }
    }
});

// تسجيل الدخول باستخدام توكن الديسكورد
client.login(process.env.DISCORD_TOKEN);
