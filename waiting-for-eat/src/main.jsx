import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Boss from "./pages/Boss";
import DinerInfo from "./pages/Diner/DinerInfo.jsx";
import DinerInfoEdit from "./pages/Diner/DinerInfoEdit";
import DislikeShop from "./pages/Diner/DislikeShop";
import EatenShop from "./pages/Diner/EatenShop";
import LikeShop from "./pages/Diner/LikeShop";
import Posted from "./pages/Diner/Posted";
import PostedEdit from "./pages/Diner/PostedEdit.jsx";
import ReservedShop from "./pages/Diner/ReservedShop";
import TextEditor from "./pages/Diner/TextEditor.jsx";
import Diner from "./pages/Diner/index.jsx";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Reserve from "./pages/Reserve";
import Restaurant from "./pages/Restaurant";
import Search from "./pages/Search";
import SignUp from "./pages/SignUp";
import Test from "./pages/test";

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <React.StrictMode>
  <NextUIProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/restaurant/:companyId" element={<Restaurant />} />
          <Route path="/reserve/:companyId" element={<Reserve />} />

          <Route path="/diner" element={<Diner />}>
            <Route path="/diner/dinerInfo/:userId" element={<DinerInfo />} />
            <Route
              path="/diner/dinerInfoEdit/:userId"
              element={<DinerInfoEdit />}
            />
            <Route
              path="/diner/reservedShop/:userId"
              element={<ReservedShop />}
            />
            <Route path="/diner/eatenShop/:userId" element={<EatenShop />} />
            <Route path="/diner/likeShop/:userId" element={<LikeShop />} />
            <Route
              path="/diner/dislikeShop/:userId"
              element={<DislikeShop />}
            />
            <Route path="/diner/posted/:userId" element={<Posted />} />
          </Route>

          <Route path="/diner/textEditor/:orderId" element={<TextEditor />} />
          <Route path="/diner/postedEdit/:postId" element={<PostedEdit />} />

          <Route path="/post/:postId" element={<Post />} />
          <Route path="/boss/:companyId" element={<Boss />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </NextUIProvider>,
  //   </React.StrictMode>,
);
