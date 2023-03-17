import LRU from 'lru-cache';
import { ONE_HOUR } from 'infrastructure/constants';
import { CachedInlineSticker } from 'types/inline';


const options = {
  ttl: ONE_HOUR,
  ttlAutopurge: true,
};

const lruInstance = new LRU<string, CachedInlineSticker>(options);

const setInlineSticker = (data: CachedInlineSticker) => {
  lruInstance.set(data.stickerFileUniqueId, data);
};

const getInlineSticker = (fileId: string) => lruInstance.get(fileId);

const lruCache = {
  set: lruInstance.set.bind(lruInstance),
  get: (k: string) => lruInstance.get(k),
  setInlineSticker,
  getInlineSticker,
};

export { lruCache };
