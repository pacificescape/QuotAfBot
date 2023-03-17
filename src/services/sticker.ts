import { Database, DefaultStickers, HydratedUser, logger } from 'infrastructure';


type mode = 'inline' | 'private';

export const addToFavorite = async (user: HydratedUser, mode: mode, id: string) => {
  const settings = user.settings[mode].stickers;

  settings[id] = DefaultStickers[mode][id] || [id, 'sharkDefaultAnimation', 'defaultAnimation'];
  await updateSettings(user, mode, settings);
};

export const deleteFromFavorite = async (user: HydratedUser, mode: mode, id: string) => {
  const settings = user.settings[mode].stickers;

  delete settings[id];
  await updateSettings(user, mode, settings);
};

const updateSettings = async (user: HydratedUser, mode: mode, settings: object) => {
  await Database.User.updateOne(
    { _id: user._id },
    {
      $set: {
        [`settings.${mode}.stickers`]: settings,
      },
    },
  ).catch(logger.error);
};


// this script takes json of external sticker and normalize it to 30fps and 3 sec of length

const round15 = (n: number) => Math.round(n / 15) * 15;
const getAims = (frames: number, fr: number) => {
  const ratio = fr / 30;
  let aimLength: number;
  const round = round15(frames / ratio);

  switch (round) {
  case 0: {
    aimLength = 15;

    break;
  }
  case 60: {
    aimLength = 45;

    break;
  }
  case 75: {
    aimLength = 90;

    break;
  }
  default: {
    aimLength = round;
  }
  }

  return {
    length: aimLength,
    t: (f: number) => {
      const res = (f / (frames / aimLength));

      return res;
    },
    rotate: 90 / aimLength,
  };
};

export const normalizeSticker = (json: any) => {
  const { ip, op, fr } = json;
  const frames = op - ip;


  logger.debug('length', frames);
  logger.debug('Stickers length %ss', frames / fr);
  logger.debug('fr', fr);
  logger.debug('length', frames);

  const { length, t, rotate } = getAims(frames, fr);

  const keys = new Set(['st', 'ip', 'op', 't']);
  const handledFlag = 'temp__isAlreadyHandled__';
  const pass = (o: object) => {
    for (const prop in o) {
      if (typeof (o[prop]) === 'object') {
        if (!o[prop][handledFlag]) {
          Object.defineProperty(o[prop], handledFlag, {
            value: true,
            writable: false,
            configurable: true,
          });
          pass(o[prop]);
        }
        delete o[prop][handledFlag];
      }
      if (keys.has(prop)) {
        o[prop] = t(o[prop]);
      }
    }
    return o;
  };

  const ms = Date.now();

  pass(json);
  logger.debug(`${(Date.now() - ms) / 1000}s`);
  logger.debug('rotate', rotate);
  logger.debug('length', length);

  json.ip = 0;
  json.op = 90;
  json.fr = 30;

  return { json, options: { rotate } };
};

export const wrapLayers = (json: { layers: Array<any>, assets: Array<any>}, id: string) => {
  const assets = json.assets;

  assets.push({
    id,
    layers: json.layers,
  });

  return assets;
};
