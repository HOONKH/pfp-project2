import { FC, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ImyOutletContext, NftMetadata } from "../types";
import axios from "axios";
import SaleNftCard from "../componenets/SaleNftCard";

const OnSale: FC = () => {
  const { saleNftContract, mintNftContract } =
    useOutletContext<ImyOutletContext>();
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);

  const getMyNfts = async () => {
    try {
      const onSaleNfts: bigint[] = await saleNftContract.methods
        .getOnSaleNFTs()
        .call();

      let temp: NftMetadata[] = [];

      for (let i = 0; i < onSaleNfts.length; i++) {
        const metadataURI: string = await mintNftContract.methods
          //@ts-expect-error
          .tokenURI(onSaleNfts[i])
          .call();

        const response = await axios.get(metadataURI);
        temp.push({ ...response.data, tokenId: Number(onSaleNfts[i]) });
      }
      setMetadataArray(temp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyNfts();
  }, [mintNftContract]);

  return (
    <>
      <img
        className="background"
        src="/images/landingbackground.png"
        alt="background"
      />
      <div className="h-28"></div>
      <div className="min-h-screen mx-auto max-w-screen-2xl bg-[#1a1a1a]  grid grid-cols-2 justify-items-center pt-10 shadow-inner shadow-slate-600 text-white ">
        {metadataArray.map((v, i) => (
          <SaleNftCard
            key={i}
            image={v.image}
            name={v.name}
            tokenId={v.tokenId!}
            metadataArray={metadataArray}
            setMetadataArray={setMetadataArray}
          />
        ))}
      </div>
    </>
  );
};

export default OnSale;
