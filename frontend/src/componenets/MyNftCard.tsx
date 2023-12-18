import { FC, FormEvent, useEffect, useState } from "react";
import NftCard from "./NftCard";
import { Link, useOutletContext } from "react-router-dom";
import { ImyOutletContext } from "../types";
import axios from "axios";
import { MINT_NFT_CONTRACT } from "../abis/ContractAddress";

export interface ImyNftCard {
  name: string;
  image: string;
  tokenId: number;
}

const MyNftCard: FC<ImyNftCard> = ({ name, image, tokenId }) => {
  const { account, mintNftContract, saleNftContract, web3 } =
    useOutletContext<ImyOutletContext>();
  const [price, setPrice] = useState<string>("");
  const [registedPrice, setRegistedPrice] = useState<number>(0);

  const onClickMint = async () => {
    try {
      await mintNftContract.methods.mintNFT().send({ from: account });
      //@ts-expect-error
      const balance = await mintNftContract.methods.balance(account).call();

      const tokenId = await mintNftContract.methods
        //@ts-expect-error
        .tokenOfOwnerById(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        //@ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitSale = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (isNaN(+price)) return;

      await saleNftContract.methods

        .setForSaleNFT(
          //@ts-expect-error
          MINT_NFT_CONTRACT,
          tokenId,
          web3.utils.toWei(Number(price), "ether")
        )
        .send({ from: account });

      setRegistedPrice(+price);
      setPrice("");
      alert("판매등록이 완료되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  const getRegistedPrice = async () => {
    try {
      //@ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;
    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div className="flex flex-col smash">
      <ul className="mt-8 ">
        <NftCard name={name} image={image} tokenId={tokenId} />
      </ul>
      {registedPrice ? (
        <div className="text-right text-3xl">{registedPrice} ETH</div>
      ) : (
        <form
          onClick={onSubmitSale}
          className="text-right text-2xl mt-2 text-black"
        >
          <input
            placeholder=" Value"
            className="border-2 border-none rounded-md mx-2 hover:slate-200 "
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button type="submit" className="text-white">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default MyNftCard;
