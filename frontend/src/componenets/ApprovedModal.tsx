import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { ImyOutletContext } from "../types";
import { SALE_NFT_CONTRACT } from "../abis/ContractAddress";
import { useSDK } from "@metamask/sdk-react";

interface IlandingProp {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ApprovedModal: FC<IlandingProp> = ({ setIsOpen }) => {
  const { sdk } = useSDK();
  const { account, mintNftContract, setAccount } =
    useOutletContext<ImyOutletContext>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const metaMaskModalLogin = async () => {
    try {
      const accounts: any = await sdk?.connect();

      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

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
        .send({ from: account });

      setSaleStatus(!saleStatus);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    getSaleStatus();
  }, [account]);

  return (
    <div className="fixed w-full h-full bg-black bg-opacity-40 text-[#d6d6d6] top-0">
      <div className="fixed left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#211d29] w-[400px] h-[400px] flex flex-col justify-center items-center gap-8 rounded-lg shadow-inner shadow-slate-400 smash text-2xl">
        <div className="text-right absolute right-0 top-0 mr-2">
          <button
            className="hover:scale-110 duration-200 text-3xl"
            onClick={() => setIsOpen(false)}
          >
            x
          </button>
        </div>

        <button className="modalbutton" onClick={onClickSaleStatus}>
          GET SALE APPROVED :{saleStatus ? "AUTHORIZED" : "UNAUTHORIZED"}
        </button>

        {account ? (
          <div className="flex items-center justify-center flex-col">
            <div>
              {account.substring(0, 7)}...
              {account.substring(account.length - 6)}
            </div>
            <button className="modalbutton" onClick={() => setAccount("")}>
              Logout
            </button>
          </div>
        ) : (
          <button className="modalbutton" onClick={metaMaskModalLogin}>
            Login
          </button>
        )}
        <Link
          className="border-2 border-none shadow-inner shadow-slate-400 rounded-lg py-2 px-2 hover:shadow-slate-200"
          to="/onsale"
        >
          Let's Buy a NFT
        </Link>
      </div>
    </div>
  );
};

export default ApprovedModal;
