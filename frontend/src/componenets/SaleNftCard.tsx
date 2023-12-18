import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { ImyNftCard } from "./MyNftCard";
import { ImyOutletContext, NftMetadata } from "../types";
import { Link, useOutletContext } from "react-router-dom";
import { MINT_NFT_CONTRACT } from "../abis/ContractAddress";

interface IsaleNftCardProps extends ImyNftCard {
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const SaleNftCard: FC<IsaleNftCardProps> = ({
  image,
  name,
  tokenId,
  metadataArray,
  setMetadataArray,
}) => {
  const { saleNftContract, mintNftContract, web3, account } =
    useOutletContext<ImyOutletContext>();
  const [registedPrice, setRegistedPrice] = useState<number>(0);
  const [isHover, setIsHover] = useState<boolean>(false);

  const getRegistedPrice = async () => {
    try {
      //@ts-expect-error
      const response = await saleNftContract.methods.nftPrices(tokenId).call();

      setRegistedPrice(Number(web3.utils.fromWei(Number(response), "ether")));
    } catch (error) {
      console.error(error);
    }
  };

  const onClickPurChase = async () => {
    try {
      const nftOwner: string = await mintNftContract.methods
        //@ts-expect-error
        .ownerOf(tokenId)
        .call();

      if (!account || nftOwner.toLowerCase() === account.toLowerCase()) return;

      await saleNftContract.methods
        //@ts-expect-error
        .purchaseNFT(MINT_NFT_CONTRACT, tokenId)
        .send({
          from: account,
          value: web3.utils.toWei(registedPrice, "ether"),
        });
      const temp = metadataArray.filter((v) => {
        if (v.tokenId === tokenId) {
          return v;
        }
      });

      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!saleNftContract) return;
    getRegistedPrice();
  }, [saleNftContract]);

  return (
    <div className="smash text-2xl text-[#d6d6d6] ">
      <img className="w-[400px] h-[400px]" src={image} alt={name} />
      <div>{name}</div>
      {registedPrice && (
        <div className="flex gap-4 items-end justify-end">
          <button>{registedPrice} ETH</button>
          <button onClick={onClickPurChase} className="hover:text-slate-400">
            Purchase
          </button>
        </div>
      )}
    </div>
  );
};

export default SaleNftCard;
