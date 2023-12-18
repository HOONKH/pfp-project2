import { FC, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ImyOutletContext, NftMetadata } from "../types";
import axios from "axios";
import NftCard from "../componenets/NftCard";

const GET_AMOUNT = 6;

const Mint: FC = () => {
  const { mintNftContract } = useOutletContext<ImyOutletContext>();
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNft, setTotalNft] = useState<number>(0);
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const detectRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getMyNfts();
      }
    });
    if (!detectRef.current) return;

    observer.current.observe(detectRef.current);
  };

  const getTotalSupply = async () => {
    try {
      if (!mintNftContract) return;
      const totalSupply = await mintNftContract.methods.totalSupply().call();

      setSearchTokenId(Number(totalSupply));
      setTotalNft(Number(totalSupply));
    } catch (error) {
      console.error(error);
    }
  };

  const getMyNfts = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;

      let temp: NftMetadata[] = [];

      for (let i = 0; i < GET_AMOUNT; i++) {
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            //@ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();

          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: searchTokenId - i });
        }
      }
      setSearchTokenId(searchTokenId - GET_AMOUNT);
      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTotalSupply();
  }, [mintNftContract]);

  useEffect(() => {
    if (totalNft === 0) return;
    getMyNfts();
  }, [totalNft]);

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
  }, [metadataArray]);

  return (
    <>
      <img
        className="background"
        src="/images/landingbackground.png"
        alt="background"
      />
      <div className="h-28"></div>
      <div className="min-h-screen grow mx-auto max-w-screen-xl rounded-t-md bg-[##211d29] grid grid-cols-2 justify-items-center pt-10 shadow-inner shadow-slate-400 text-white ">
        {metadataArray?.map((v, i) => (
          <NftCard key={i} image={v.image} name={v.name} tokenId={v.tokenId!} />
        ))}
      </div>
      <div className="py-5" ref={detectRef}></div>
    </>
  );
};

export default Mint;
