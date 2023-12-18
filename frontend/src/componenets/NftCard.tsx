import { FC } from "react";
import { ImyNftCard } from "./MyNftCard";
import { Link } from "react-router-dom";

interface InftCard extends ImyNftCard {}

const NftCard: FC<InftCard> = ({ image, name, tokenId }) => {
  return (
    <Link to={`/detail/${tokenId}`}>
      <div className="pt-4 smash">
        <ul className="">
          <li className="w-[400px] h-[400px] overflow-hidden  rounded-md">
            <img
              className="w-[400px] h-[400px] rounded-md hover:scale-110 duration-200"
              src={image}
              alt={name}
            />
          </li>
          <li className="text-2xl pt-4">{name}</li>
        </ul>
      </div>
    </Link>
  );
};

export default NftCard;
