import { FC, useState } from "react";
import { ImyNftCard } from "./MyNftCard";
import { Link } from "react-router-dom";

interface InftCard extends ImyNftCard {}

const NftCard: FC<InftCard> = ({ image, name, tokenId }) => {
  return (
    <Link to={`/detail/${tokenId}`}>
      <div className="pt-4 smash">
        <ul className="">
          <li className="w-[500px] h-[500px] overflow-hidden rounded-md relative flex items-center justify-center hover:scale-105 duration-200 ">
            <img
              className="absolute w-[480px] h-[480px]  "
              src="/images/akjaya.png"
              alt="akja"
            />
            <img
              className="w-[400px] h-[400px]  rounded-md "
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
