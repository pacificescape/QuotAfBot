import bot from 'bot';


const url_prefix = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}`;

const getFile = async (fileId: string) => {
  const { file_path } = await bot.api.getFile(fileId);
  const url = `${url_prefix}/${file_path}`;
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
};


export default getFile;
