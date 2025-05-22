export interface JettonFeatures {
  mintable: boolean;
  burnable: boolean;
  sharded: boolean;
  onchainApi: boolean;
  jettonSendMode: boolean;
  governance: boolean;
}

export const defaultFeatures: JettonFeatures = {
  mintable: true,
  burnable: false,
  sharded: true,
  onchainApi: false,
  jettonSendMode: false,
  governance: false,
};

export type FeatureId = keyof JettonFeatures;

export interface Feature {
  id: FeatureId;
  label: string;
  description: string;
}

export const featuresList: Feature[] = [
  {
    id: 'mintable',
    label: 'Mintable',
    description: 'Allow minting of new tokens after deployment and initial mint',
  },
  {
    id: 'sharded',
    label: 'Sharded',
    description: 'Enable sharding for jettons',
  },
  {
    id: 'onchainApi',
    label: 'On-chain API',
    description: 'Enable on-chain balance API for smart contract interactions',
  },
  {
    id: 'jettonSendMode',
    label: 'Jetton Send Mode',
    description: 'Configure custom send modes for jetton transfers',
  },
]; 