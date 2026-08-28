const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const getPatchVersion = async () => {
  const response = await fetch(
    'https://ddragon.leagueoflegends.com/api/versions.json',
  );
  const json = await response.json();
  return json[0];
};

export const Utils = { isProduction, isDevelopment, isTest, getPatchVersion };
