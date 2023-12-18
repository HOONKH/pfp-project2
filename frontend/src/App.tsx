import { FC, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/landing";
import MyPage from "./pages/mypage";
import Mint from "./pages/mint";
import Layout from "./componenets/Layout";
import OnSale from "./pages/onsale";
import Detail from "./pages/detail";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/onsale" element={<OnSale />} />
          <Route path="/detail/:tokenId" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
