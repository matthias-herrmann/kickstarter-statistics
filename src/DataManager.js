import data from './assets/data';
import countryCodeConversions from './assets/countryISOCodeConversions';

export const convertCountryCode = (code) => {
  return countryCodeConversions[code] || "404"
};

export const dataSetToCountryObject = (dataSet) => {
  return {
    [dataSet['country']]: {
      ...dataSet
    }
  }
};

/**
 * Returns all datasets as a list
 * @returns {{country: *}[]}
 */
export const dataList = () => {
  return Object.values(data).map(e => ({
    ...e,
    'country': convertCountryCode(e['country']),
  }))
};

/**
 * Generates a object with country codes as keys
 * @returns {*} Object in the form of {"countrycode": {data...}, ...}
 */
export const countryObject = () => {
  return asList().reduce((obj, dataSet) => ({
    ...obj,
    ...dataSetToCountryObject(dataSet),
  }), {});
};

/**
 * Generates colors for all countries
 * @param colorFunction The function to convert the dataset to a color.
 * @returns {*} A object in the form of {"countrycode": color, ...}
 */
export const countryToColors = (colorFunction) => {
  return dataList().reduce((obj, dataSet) => ({
    ...obj,
    [dataSet["country"]]: colorFunction(dataSet),
  }), {});
};

export const getValueList = (key) => {
  return dataList().map(dataSet => dataSet[key]);
};

export const percentile = (key, percent) => {
  const values = getValueList(key).sort(),
    index = Math.floor(values.length * percent);
  return values[index];
};

export const min = (key) => {
  return Math.min(...getValueList(key));
};

export const max = (key) => {
  return Math.max(...getValueList(key));
};

export const median = (key) => {
  return percentile(key, 0.5);
};

export const avg = (key) => {
  const values = getValueList(key);
  return values.reduce((prev, curr) => prev + curr, 0) / values.length;
};
