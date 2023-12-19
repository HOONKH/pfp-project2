import { Dispatch, FC, SetStateAction, useState } from "react";
import { ImyOutletContext, NftMetadata } from "../types";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

interface ImintModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  metadataArray: NftMetadata[];
  setMetadataArray: Dispatch<SetStateAction<NftMetadata[]>>;
}

const MintModal: FC<ImintModalProps> = ({
  setIsOpen,
  metadataArray,
  setMetadataArray,
}) => {
  const { mintNftContract, account } = useOutletContext<ImyOutletContext>();
  const [metadata, setMetadata] = useState<NftMetadata>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onClcikMint = async () => {
    try {
      if (!mintNftContract || !account) return;

      setIsLoading(true);

      await mintNftContract.methods.mintNFT().send({ from: account });

      //@ts-expect-error
      const balance = await mintNftContract.methods.balanceOf(account).call();

      const tokenId = await mintNftContract.methods
        //@ts-expect-error
        .tokenOfOwnerByIndex(account, Number(balance) - 1)
        .call();

      const metadataURI: string = await mintNftContract.methods
        //@ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
      setMetadataArray([response.data, ...metadataArray]);
      setIsLoading(false);
      setIsOpen(false);
      alert("민팅이 완료되었습니다!");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full fixed top-0 bg-black bg-opacity-50">
      <div className="fixed w-[500px] h-[500px] bg-[#211d29] text-[#d6d6d6] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-lg shadow-inner shadow-slate-400 smash ">
        <div className="text-right absolute right-0 top-0 mr-2 ">
          <button
            className="hover:scale-110 duration-200 text-3xl"
            onClick={() => setIsOpen(false)}
          >
            x
          </button>
        </div>
        <div className="flex justify-center items-center flex-col ">
          <button className="modalbutton text-4xl" onClick={onClcikMint}>
            Let's Mint
          </button>
          {isLoading && <div className="mt-4">잠시만 기다려 주세요.</div>}
        </div>
      </div>
    </div>
  );
};

export default MintModal;
