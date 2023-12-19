import { FC, useEffect, useRef, useState } from "react";
import { ImyOutletContext, NftMetadata } from "../types";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import MyNftCard from "../componenets/MyNftCard";
import { SALE_NFT_CONTRACT } from "../abis/ContractAddress";
import MintModal from "../componenets/MintModal";

const MyPage: FC = () => {
  const { account, mintNftContract } = useOutletContext<ImyOutletContext>();
  const [metadataArray, setMetadataArray] = useState<NftMetadata[]>([]);
  const [saleStatus, setSaleStatus] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchTokenId, setSearchTokenId] = useState<number>(0);
  const [totalNFT, setTotalNFT] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const observer = useRef<IntersectionObserver>();
  const detectRef = useRef<HTMLDivElement>(null);

  const observe = () => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && metadataArray.length !== 0) {
        getMyNfts();
      }
    });
    if (!detectRef.current) return;

    observer.current.observe(detectRef.current);
  };

  // const getTotalSupply = async () => {
  //   try {
  //     if (!mintNftContract) return;
  //     const totalSupply = await mintNftContract.methods.totalSupply().call();

  //     setSearchTokenId(Number(totalSupply));
  //     setTotalNFT(Number(totalSupply));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getBalance = async () => {
    try {
      if (!account) return;

      //@ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      setSearchTokenId(Number(balance));
      setTotalNFT(Number(balance));
    } catch (error) {
      console.error(error);
    }
  };

  const getMyNfts = async () => {
    try {
      if (!mintNftContract || searchTokenId <= 0) return;
      // //@ts-expect-error
      // const balance = await mintNftContract.methods.balanceOf(account).call();
      // 내 계좌 조회

      let temp: NftMetadata[] = [];

      for (let i = 0; i < 6; i++) {
        // const tokenId = await mintNftContract.methods
        //   //@ts-expect-error
        //   .tokenOfOwnerByIndex(account, i)
        //   .call();
        if (searchTokenId - i > 0) {
          const metadataURI: string = await mintNftContract.methods
            //@ts-expect-error
            .tokenURI(searchTokenId - i)
            .call();
          const response = await axios.get(metadataURI);

          temp.push({ ...response.data, tokenId: Number(searchTokenId) - i });
        }
      }
      setSearchTokenId(searchTokenId - 6);
      setMetadataArray([...metadataArray, ...temp]);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    observe();

    return () => observer.current?.disconnect();
  }, [metadataArray]);

  useEffect(() => {
    if (!mintNftContract) return;
    getBalance();
  }, [mintNftContract]);

  const getSaleStatus = async () => {
    try {
      const isApproved: boolean = await mintNftContract.methods
        //@ts-expect-error
        .isApprovedForAll(account, SALE_NFT_CONTRACT)
        .call();

      setSaleStatus(isApproved);
    } catch (error) {
      console.error(error);
    }
  };

  const onClickSaleStatus = async () => {
    try {
      await mintNftContract.methods
        //@ts-expect-error
        .setApprovalForAll(SALE_NFT_CONTRACT, !saleStatus)
        .call();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (totalNFT === 0) return;
    getMyNfts();
  }, [totalNFT]);

  useEffect(() => {
    console.log(metadataArray);
  }, [mintNftContract]);

  useEffect(() => {
    if (!account) return;
    getSaleStatus();
  }, [account]);

  useEffect(() => {
    if (account) return;
    navigate("/");
    alert("로그인이 필요합니다");
  }, [account]);

  return (
    <>
      <div className="textcolor h-28">
        <div className="flex justify-end items-center px-10 py-4 text-xl font-bold flex-col gap-4 ">
          <img
            className="background"
            src="/images/landingbackground.png"
            alt="back"
          />
          <button
            onClick={onClickSaleStatus}
            className="smash hover:scale-110 duration-200 hover:text-gray-100"
          >
            SALE APPROVED : {saleStatus ? "AUTOHRIZED" : "UNAUTHORIZED"}
          </button>
          <button
            className="smash text-3xl hover:scale-110 duration-200 hover:text-gray-100"
            onClick={onClickModal}
          >
            {`> Mint <`}
          </button>
        </div>
      </div>
      <div className="grow w-full mx-auto bg-[#1a1a1a] min-h-screen justify-items-center grid grid-cols-3 pt-10 shadow-inner shadow-slate-600 text-white">
        {metadataArray.map((v, i) => (
          <MyNftCard
            key={i}
            image={v.image}
            name={v.name}
            tokenId={v.tokenId!}
          />
        ))}
        {isOpen && (
          <MintModal
            metadataArray={metadataArray}
            setMetadataArray={setMetadataArray}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
      <div ref={detectRef} className="py-4 bg-transparent"></div>
    </>
  );
};

export default MyPage;
