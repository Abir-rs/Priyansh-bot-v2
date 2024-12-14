module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe"],
  version: "6.9.0",
  author: "dipto",
  countDown: 0,
  role: 0,
  description: "better then all sim simi",
  category: "chat",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NewMessage]"
  }
};

module.exports.onStart = async ({ api, event, args, usersData }) => {
  const axios = require('axios');
  const baseApiUrl = async () => {
  const base = await axios.get('https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json');
  return base.data.api;
};
  const link = `${await baseApiUrl()}/baby`;
  const dipto = args.join(" ").toLowerCase();
  const uid = event.senderID;

  try {
    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    switch (args[0]) {
      case 'remove': {
        const fina = dipto.replace("remove ", "").trim();
        if (!fina) return api.sendMessage('❌ | Specify a message to remove!', event.threadID, event.messageID);
        const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
        return api.sendMessage(dat, event.threadID, event.messageID);
      }

      case 'rm': {
        if (!dipto.includes(' - ')) return api.sendMessage('❌ | Use: rm [YourMessage] - [IndexNumber]', event.threadID, event.messageID);
        const [fi, f] = dipto.replace("rm ", "").split(' - ');
        if (!fi || !f) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
        const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
        return api.sendMessage(da, event.threadID, event.messageID);
      }

      case 'list': {
        if (args[1] === 'all') {
          const data = (await axios.get(`${link}?list=all`)).data;
          const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
            const number = Object.keys(item)[0];
            const value = item[number];
            const name = (await usersData.get(number)).name;
            return { name, value };
          }));
          teachers.sort((a, b) => b.value - a.value);
          const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
          return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
        } else {
          const d = (await axios.get(`${link}?list=all`)).data.length;
          return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
        }
      }

      case 'msg': {
        const fuk = dipto.replace("msg ", "").trim();
        if (!fuk) return api.sendMessage('❌ | Specify a message!', event.threadID, event.messageID);
        const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
        return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
      }

      case 'edit': {
        if (!dipto.includes(' - ')) return api.sendMessage('❌ | Use: edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
        const [oldMsg, newMsg] = dipto.replace("edit ", "").split(' - ');
        if (!oldMsg || !newMsg) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
        const dA = (await axios.get(`${link}?edit=${oldMsg}&replace=${newMsg}&senderID=${uid}`)).data.message;
        return api.sendMessage(`Changed: ${dA}`, event.threadID, event.messageID);
      }

      case 'teach': {
        if (!dipto.includes(' - ')) return api.sendMessage('❌ | Use: teach [YourMessage] - [Reply1], [Reply2], ...', event.threadID, event.messageID);
        const [comd, command] = dipto.replace("teach ", "").split(' - ');
        if (!comd || !command) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
        const re = await axios.get(`${link}?teach=${comd}&reply=${command}&senderID=${uid}`);
        const tex = re.data.message;
        const teacher = (await usersData.get(re.data.teacher)).name;
        return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
      }

      default: {
        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            d, 
            apiUrl: link
          });
        }, event.messageID);
      }
    }

  } catch (e) {
    console.log(e);
    api.sendMessage("❌ | An error occurred. Check console for details.", event.threadID, event.messageID);
  }
};
