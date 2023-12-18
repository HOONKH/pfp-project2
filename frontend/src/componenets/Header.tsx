import { useSDK } from "@metamask/sdk-react";
import { Dispatch, FC, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface IheaderProps {
  account: string;
  setAccount: Dispatch<SetStateAction<string>>;
}

const Header: FC<IheaderProps> = ({ account, setAccount }) => {
  const { sdk } = useSDK();

  const metaMaskLogin = async () => {
    const accounts: any = await sdk?.connect();

    setAccount(accounts[0]);
  };

  return (
    <div className="bg-[#1a1a1a] w-full flex justify-between  text-2xl py-4 px-8 sticky top-0 shadow-inner shadow-slate-400 rounded-b-lg">
      <div className="flex gap-10 text-[#a1a1a1] crang ">
        <Link to="/">Home</Link>
        <Link to="/mypage">MyPage</Link>
        <Link to="/mint">View</Link>
        <Link to="/onsale">on Sale</Link>
      </div>
      <div className="flex gap-4 items-center text-[#a1a1a1]">
        {account ? (
          <>
            <div className="text-xl">
              {account.substring(0, 7)}...
              {account.substring(account.length - 6)}
              {/* 복사기능 붙이기 */}
            </div>
            <button className="crang" onClick={() => setAccount("")}>
              Logout
            </button>
          </>
        ) : (
          <button className="crang" onClick={metaMaskLogin}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
