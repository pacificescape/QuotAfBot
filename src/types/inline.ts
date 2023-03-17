export declare namespace CachedInlineSticker {
  interface AbstractCache {
    /** Unique identifier for generated sticker */
    stickerFileUniqueId: string,
    /** Type of cache, can be either "favorite", "delete", "random" */
    type: string,
    /** Unique identifier for file_unique_id of component*/
    componentUniqueId: string,
  }

  export interface FavoriteCachedInlineSticker extends AbstractCache {
    type: 'favorite'
  }

  export interface DeleteCachedInlineSticker extends AbstractCache {
    type: 'delete',

    from: 'inline' | 'private',
  }

  export interface RandomCachedInlineSticker extends AbstractCache {
    type: 'random',
  }
}

export type CachedInlineSticker = CachedInlineSticker.DeleteCachedInlineSticker | CachedInlineSticker.FavoriteCachedInlineSticker | CachedInlineSticker.RandomCachedInlineSticker;


type GenerateOptions<T extends CachedInlineSticker.AbstractCache> = Omit<T, 'stickerFileUniqueId' | 'componentUniqueId'>;

export type GenerateInlineCacheOptions = (
  | GenerateOptions<CachedInlineSticker.FavoriteCachedInlineSticker>
  | GenerateOptions<CachedInlineSticker.RandomCachedInlineSticker>
  | GenerateOptions<CachedInlineSticker.DeleteCachedInlineSticker>
);
