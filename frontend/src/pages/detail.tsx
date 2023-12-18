import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { ImyOutletContext, NftMetadata } from "../types";
import axios from "axios";

const Detail: FC = () => {
  const { tokenId } = useParams();

  const { mintNftContract } = useOutletContext<ImyOutletContext>();
  const [metadata, setMetadata] = useState<NftMetadata>();
  const [isHover, setIsHover] = useState<boolean>();
  const navigate = useNavigate();

  const handleMouseMove = (e: MouseEvent) => {
    const x: any = e.clientX / window.innerWidth;
    const y: any = e.clientY / window.innerHeight;

    document.documentElement.style.setProperty("--mouse-x", x);
    document.documentElement.style.setProperty("--mouse-y", y);
  };

  const getMyNft = async () => {
    try {
      if (!mintNftContract) return;

      const metadataURI: string = await mintNftContract.methods
        //@ts-expect-error
        .tokenURI(tokenId)
        .call();

      const response = await axios.get(metadataURI);

      setMetadata(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMyNft();
  }, [mintNftContract]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="body w-full h-full">
      <div className="h-10"></div>
      <button
        onClick={() => navigate(-1)}
        className="text-4xl px-10 text-black smash"
      >
        BACK
      </button>
      <div className="flex items-center justify-center mt-20 ">
        <div className="w-[500px] h-[500px]">
          <img
            className="hover:scale-110 duration-300 rounded-md shadow-xl shadow-black"
            src={metadata?.image}
            alt={metadata?.name}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          />
        </div>

        <ul className="smash text-3xl ml-8">
          <div className="smash text-4xl ">{metadata?.name}</div>
          <li className="mt-4">{metadata?.description}</li>
          {metadata?.attributes.map((v, i) => (
            <ul key={i}>
              <span>{v.trait_type} :</span>
              <span> {v.value}</span>
            </ul>
          ))}
        </ul>
      </div>

      {isHover && (
        <div className="bottom-[400px] right-[800px] duration-200 fixed">
          <img className="fixed" src="/images/Kitty.png" alt="kitty" />
        </div>
      )}
    </div>
  );
};

export default Detail;
