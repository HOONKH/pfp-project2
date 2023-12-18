import { Dispatch, SetStateAction } from "react";
import Web3, { Contract, ContractAbi } from "web3";

export interface ImyOutletContext {
  mintNftContract: Contract<ContractAbi>;
  saleNftContract: Contract<ContractAbi>;
  web3: Web3;
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}

export interface NftMetadata {
  image: string;
  name: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  tokenId?: number;
}
