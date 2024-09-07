import { openai } from "@/utils/helper";

export const config = {
  api: {
    bodyParser: false,
  },
};

const genarateText = async (text) => {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Bana ingilizce, sosyal medyada sıkça paylaşılan memelerde kullanılan komik, ironik, sürprizli, absürt ve zıtlık veya bağlantı içeren cümleler oluşturmam için yardımcı ol.`,
        },
        {
          role: "user",
          content: `Belirtilen ifadeden yola çıkarak ingilizce komik, ironik, sürprizli, absürt ve içerisinde zıtlık veya bağlantı içeren, sosyal medyada sıkça paylaşılan memelerdeki gibi mizahi bir dil kullanan 10 kelimeyi geçmeyen 6 adet meme cümlesi oluştur. Cümleler birbirine benzemesin ve yalnızca cevap olarak cümleleri dön.Ayrıca cümleler tüm özellikleri aynı anda barındırmak zorunda değil. İşte ifade: """${text}"""`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const memeSentences = response.data.choices[0].message.content.split("\n").map((sentence) => {
      return sentence.replace(/[0-9".]/g, "");
    });

    return memeSentences;
  } catch (err) {
    console.log(err);
    return res.status(404).json({ msg: "Bad request" });
  }
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await genarateText(text, outputLang, 6).then(async (data) => {
        const memes = await Promise.all(
          data.map((meme) => {
            const half = Math.floor(meme.split(" ").length / 2);

            return {
              width: "",
              image_name: image_name,
              captions: [
                {
                  x: 0,
                  y: 0,
                  witdh: 200,
                  height: 40,
                  text: meme.split(" ").slice(0, half).join(" "),
                  fontColor: "#fff",
                  borderColor: "#000",
                },
                {
                  x: 0,
                  y: 300,
                  witdh: 200,
                  height: 40,
                  text: meme.split(" ").slice(half).join(" "),
                  fontColor: "#fff",
                  borderColor: "#000",
                },
              ],
            };
          })
        );

        return res.status(200).json({
          msg: "text to meme succes",
          data: memes,
          credits: user.credits,
        });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
