import bot from 'bot';
import { InputFile } from 'grammy';
import { AnimatedStickerFile } from 'types';


export const uploadAnimatedStickerFile = async (id: number, file: InputFile): Promise<AnimatedStickerFile> => {
  const uploadedFile = await bot.api.uploadStickerFile(id, 'animated', file);

  return {
    ...uploadedFile,
    componentUniqueId: file.filename,
  };
};
