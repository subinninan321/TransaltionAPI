const axios = require('axios');
const Api = require('../models/apiModel');
const { client } = require('../utils/redisClient');

exports.getAllLanguages = async (req, h) => {
  const url = process.env.GET_ALL_LANGUAGES_API;

  try {
    const cacheData = await client.get('AllLanguages');
    if (cacheData) {
      console.log('from caches(redis)');
      const cachedLanguages = JSON.parse(cacheData);
      return h.response({
        source: 'from cache(redis)',
        translation: cachedLanguages,
      });
    }

    const languages = await axios(url);
    const data = languages.data.translation;

    const translation = Object.keys(data).map((code) => ({
      ...data[code],
      code,
    }));

    await client.set('AllLanguages', JSON.stringify(translation), { EX: 60 });

    // console.log('Translation:', translation);
    const dbEntry = new Api({
      api: 'Get All Languages API',

      request: {},
      response: translation,
    });

    await dbEntry.save();
    console.log('response from getAllLanguage api saved in db');

    return h.response({ source: 'from DB', translation });
  } catch (err) {
    return h
      .response({
        message: err.message,
      })
      .code(err.response?.status || 500);
  }
};

exports.translate = async (req, h) => {
  //console.log('Translate function called');
  const url = process.env.TRANSLATE_API;
  const { to, from } = req.query;
  const text = req.payload;
  const finalUrl = url.replace('<to>', to).replace('<from>', from);
  //console.log('Final URL:', finalUrl);

  const headers = {
    'Content-Type': process.env.HEADER_CONTENT_TYPE,
    'Ocp-Apim-Subscription-Key': process.env.HEADER_KEY,
    'Ocp-Apim-Subscription-Region': process.env.HEADER_REGION,
  };
  // console.log('Headers:', headers);
  try {
    const response = await axios.post(finalUrl, [text], { headers });

    const dbEntry = new Api({
      api: 'Translate API',
      request: {
        to,
        from,
        text,
      },
      response: response.data[0].translations[0].text,
    });

    await dbEntry.save();
    console.log('request and response for translateapi saved in db');

    return h.response({
      response: response.data.map((el) => ({
        text: el.translations[0].text,
      })),
    });
  } catch (err) {
    return h.response({
      message: err.message,
    });
  }
};
