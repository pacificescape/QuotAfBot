interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: any[];
  layers: LottieLayer[];
}

interface LottieLayer {
  ddd: number;
  ind: number;
  ty: number;
  nm: string;
  sr: number;
  ks: LottieKeyframes;
  ao?: number;
  ip: number;
  op: number;
}

interface LottieKeyframes {
  [key: string]: LottieKeyframe;
}

interface LottieKeyframe {
  a: number[];
  ix: number;
  k: LottieKeyframeValue;
  ty: number;
}

interface LottieKeyframeValue {
  [key: string]: any;
}

export {
  LottieAnimation,
  LottieLayer,
  LottieKeyframes,
  LottieKeyframe,
  LottieKeyframeValue,
};
