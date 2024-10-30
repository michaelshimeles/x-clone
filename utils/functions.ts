import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: '-',
  length: 2,
};

const randomName: string = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals]
}); // big_red_donkey

export const shortName: string = uniqueNamesGenerator(customConfig); // big-donkey
