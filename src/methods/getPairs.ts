import { TGetPairs, TCreateGetFn, LibOptions, LibRequest } from '../types';
import { AssetPair } from '@earths/data-entities';
import { createMethod } from './createMethod';
import { createRequest } from '../createRequest';

const isAssetPair = pair => {
  switch (true) {
    case typeof pair === 'string':
      return pair.split('/').length === 2;
    case typeof pair === 'object':
      return AssetPair.isAssetPair(pair);
    default:
      return false;
  }
};

const validatePairs = (
  pairOrPairs: AssetPair[] | AssetPair
): Promise<AssetPair[]> => {
  const arrayToCheck = Array.isArray(pairOrPairs) ? pairOrPairs : [pairOrPairs];
  return arrayToCheck.every(isAssetPair)
    ? Promise.resolve(arrayToCheck)
    : Promise.reject(
        new Error(
          'ArgumentsError: AssetPair should be object with amountAsset, priceAsset'
        )
      );
};

const createRequestForMany = (nodeUrl: string) => (
  pairs: AssetPair[]
): LibRequest =>
  createRequest(`${nodeUrl}/pairs`, { pairs: pairs.map(p => p.toString()) });

const getPairs: TCreateGetFn<TGetPairs> = (libOptions: LibOptions) =>
  createMethod({
    validate: validatePairs,
    generateRequest: createRequestForMany,
    libOptions,
  });

export default getPairs;
