import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import ScrollToTop from "./components/ScrollToTop/index.jsx";
import "./index.css";
import Activity from "./pages/Boss/Activity.jsx";
import ActivityEdit from "./pages/Boss/ActivityEdit.jsx";
import BossInfo from "./pages/Boss/BossInfo.jsx";
import BossInfoEdit from "./pages/Boss/BossInfoEdit";
import OpenTime from "./pages/Boss/OpenTime";
import Photo from "./pages/Boss/Photo";
import PhotoUpload from "./pages/Boss/PhotoUpload";
import Schedule from "./pages/Boss/Schedule";
import Table from "./pages/Boss/Table";
import Boss from "./pages/Boss/index.jsx";
import AddStar from "./pages/Diner/AddStar.jsx";
import Commented from "./pages/Diner/Commented.jsx";
import DinerInfo from "./pages/Diner/DinerInfo.jsx";
import DinerInfoEdit from "./pages/Diner/DinerInfoEdit";
import DislikeShop from "./pages/Diner/DislikeShop";
import EatenShop from "./pages/Diner/EatenShop";
import LikeShop from "./pages/Diner/LikeShop";
import Posted from "./pages/Diner/Posted";
import PostedEdit from "./pages/Diner/PostedEdit.jsx";
import ReservedShop from "./pages/Diner/ReservedShop";
import StarEdit from "./pages/Diner/StarEdit.jsx";
import TextEditor from "./pages/Diner/TextEditor.jsx";
import Diner from "./pages/Diner/index.jsx";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Reserve from "./pages/Reserve";
import Restaurant from "./pages/Restaurant";
import Search from "./pages/Search";
import SignUp from "./pages/SignUp";

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <React.StrictMode>
  <NextUIProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/restaurant/:companyId" element={<Restaurant />} />
          <Route path="/reserve/:companyId" element={<Reserve />} />

          <Route path="/diner" element={<Diner />}>
            <Route path="dinerInfo/:userId" element={<DinerInfo />} />
            <Route path="dinerInfoEdit/:userId" element={<DinerInfoEdit />} />
            <Route path="reservedShop/:userId" element={<ReservedShop />} />
            <Route path="eatenShop/:userId" element={<EatenShop />} />
            <Route path="likeShop/:userId" element={<LikeShop />} />
            <Route path="dislikeShop/:userId" element={<DislikeShop />} />
            <Route path="posted/:userId" element={<Posted />} />
            <Route path="commented/:userId" element={<Commented />} />
            <Route path="addStar/:userId" element={<AddStar />} />
            <Route path="starEdit/:userId" element={<StarEdit />} />
          </Route>

          <Route path="/textEditor/:orderId" element={<TextEditor />} />
          <Route path="/postedEdit/:postId" element={<PostedEdit />} />

          <Route path="/post/:postId" element={<Post />} />

          <Route path="/boss" element={<Boss />}>
            <Route path="bossInfo/:companyId" element={<BossInfo />} />
            <Route path="bossInfoEdit/:companyId" element={<BossInfoEdit />} />
            <Route path="photo/:companyId" element={<Photo />} />
            <Route path="photoUpload/:companyId" element={<PhotoUpload />} />
            <Route path="openTime/:companyId" element={<OpenTime />} />
            <Route path="activity/:companyId" element={<Activity />} />
            <Route path="activityEdit/:companyId" element={<ActivityEdit />} />
            <Route path="table/:companyId" element={<Table />} />
            <Route path="schedule/:companyId" element={<Schedule />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </NextUIProvider>,

  /* </React.StrictMode>, */
);
