import Web3, { Contract, ContractAbi } from "web3";
import { FC, useEffect, useState } from "react";
import Header from "./Header";
import { useSDK } from "@metamask/sdk-react";

import MintNftContractAbi from "../abis/MintNftContractAbi.json";
import SaleNftContractAbi from "../abis/SaleNftContractAbi.json";
import { MINT_NFT_CONTRACT, SALE_NFT_CONTRACT } from "../abis/ContractAddress";
import { Outlet } from "react-router-dom";

const Layout: FC = () => {
  const { provider } = useSDK();
  const [account, setAccount] = useState<string>("");
  const [mintNftContract, setMintNftConntract] =
    useState<Contract<ContractAbi>>();
  const [saleNftContract, setSaleNftContract] =
    useState<Contract<ContractAbi>>();
  const [web3, setWeb3] = useState<Web3>();

  useEffect(() => {
    if (!provider) return;

    setWeb3(new Web3(provider));
  }, [provider]);

  useEffect(() => {
    if (!web3) return;

    setMintNftConntract(
      new web3.eth.Contract(MintNftContractAbi, MINT_NFT_CONTRACT)
    );
    setSaleNftContract(
      new web3.eth.Contract(SaleNftContractAbi, SALE_NFT_CONTRACT)
    );
  }, [web3]);

  return (
    <div className="">
      <Header account={account} setAccount={setAccount} />
      <Outlet
        context={{
          mintNftContract,
          web3,
          account,
          saleNftContract,
          setAccount,
        }}
      />
    </div>
  );
};

export default Layout;
