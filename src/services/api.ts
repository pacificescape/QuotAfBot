import { logger } from 'infrastructure';


export const generateComponent = async (id: string, assets: object) => {
  if (!id || !assets) {return null;}
  try {
    const url = `${process.env.API_URI}component`;
    const response = await globalThis.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        assets,
      }),
    });

    const json = await response.json();

    if (!json.ok) {
      throw new Error(json.message);
    }

    return Buffer.from(json.result.data);
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const generateSticker = async (message: string, [type, typeAnimation, charAnimationType]: string[]) => {
  if (!message) {return null;}
  try {
    const url = `${process.env.API_URI}generate`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        message,
        type,
        charAnimationType,
        typeAnimation,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { result } = await response.json();

    return Buffer.from(result.data);
  } catch (error) {
    logger.error(error);
    return null;
  }
};
