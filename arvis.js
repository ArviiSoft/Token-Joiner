const chalk = require("chalk");

process.on("unhandledRejection", (reason, promise) => {
  console.log(`${chalk.redBright("[HATA]")} Hata: ${promise} - Sebep: ${reason}`);
});

process.on("uncaughtException", (err, origin) => {
  console.log(`${chalk.redBright("[HATA]")} ${err} ( ${origin} )`);
});


const gradient = require('gradient-string');
const ayarlar = require('./src/ayarlar.json');
const { Client } = require("discord.js-selfbot-v13");
var totalJoined = 0;
var failed = 0;
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require("fs");


console.log(gradient.rainbow("arviis. - Token Joiner"));

async function readTokens() {
  const tokens = fs.readFileSync('tokens.txt').toString().split("\n");

  for (i in tokens) {
    await new Promise((resolve) => setTimeout(resolve, i * ayarlar.joinDelay));
    doEverything(
      tokens[i]?.trim()?.replace("\r", "")?.replace("\n", ""),
      tokens
    );
  }
}
readTokens();
const proxies = fs.readFileSync('proxies.txt').toString().split("\n");

async function doEverything(token, tokens) {
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]?.replace("\r", "")?.replace("\n", "");
  
  client.on("ready", async () => {
    console.log(chalk.green("[TOKEN - AKTİF]") + gradient.cristal(client.user.tag));


    await client
      .fetchInvite(ayarlar.inviteCode)
      .then(async (invite) => {

        await invite
          .acceptInvite(true)
          .then(async () => {
            console.log(chalk.greenBright(`[TOKEN - SUNUCUYA GİRDİ] - ${gradient.passion(client.user.tag)}`));
            totalJoined++;
            process.title = `Başarılı: ${totalJoined} | Başarısız: ${failed}`;

            if (client.token === tokens[tokens.length - 1]) {
              console.log(`${chalk.magentaBright("[BİLGİ]")} Tokenler toplam ( ${gradient.passion(totalJoined)} ) sunucuya girdi, ( ${gradient.passion(failed)} ) sunucuda başarısız oldu.}`)

              process.title = `Başarılı: ${totalJoined} | Başarısız: ${failed}`;
            }
          })
          .catch((err) => {
            console.log(`${chalk.redBright("[HATA]")} ${gradient.fruit(client.user.tag)} Adlı token sunucuya giremedi.`);
            failed++;
            process.title = `Başarılı: ${totalJoined} | Başarısız: ${failed}`;


            console.error(chalk.redBright(err));

            if (client.token === tokens[tokens.length - 1]) {
              console.log(`${chalk.magentaBright("[BİLGİ]")} Tokenler toplam ( ${gradient.passion(totalJoined)} ) sunucuya girdi, ( ${gradient.passion(failed)} ) sunucuda başarısız oldu.}`)

              process.title = `Başarılı: ${totalJoined} | Başarısız: ${failed}`;

            }
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
