interface IPayload {
  cover?: string;
  sourceType?: string;
  sourceId?: string;
}

interface ISource {
  type: string;
  payload: IPayload;
}

const isTwitchClip = (sourceUrl: string) => {
  const regexps = [
    'https:\\/\\/clips\\.twitch\\.tv\\/(?:embed\\?clip\\=|)([^\\/?"]+)',
    'https:\\/\\/clips\\.twitch\\.tv\\/([^/?]+)\\/?',
    'https:\\/\\/www\\.twitch\\.tv\\/[^/]+\\/clip\\/([^\\/?"]+)\\/?'
  ];

  let result = null;

  for (const regexp of regexps) {
    const regexpResult = sourceUrl.match(regexp);

    if (regexpResult && regexpResult[1]) {
      result = {
        type: 'twitchClip',
        payload: {
          sourceId: regexpResult[1],
          sourceType: 'twitchClip'
        }
      };

      break;
    }
  }

  return result;
};

const isYoutbeVideo = (sourceUrl: string) => {
  const regexpResult = sourceUrl.match(
    /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@#?&%=+\/\$_.-]*/
  );

  if (regexpResult && regexpResult[1]) {
    return {
      type: 'youtubeVideo',
      payload: {
        sourceId: regexpResult[1],
        sourceType: 'youtubeVideo'
      }
    };
  }

  return null;
};

const allMethods = {
  isTwitchClip,
  isYoutbeVideo
};

export const parseSource = (sourceUrl: string): ISource => {
  let result = null;

  for (const methodName of Object.keys(allMethods)) {
    const methodResult = allMethods[methodName](sourceUrl);

    if (methodResult) {
      result = methodResult;
      break;
    }
  }

  return result;
};
