import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
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
import Commented from "./pages/Diner/Commented.jsx";
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
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
              <Route path="/diner/commented/:userId" element={<Commented />} />
            </Route>

            <Route path="/diner/textEditor/:orderId" element={<TextEditor />} />
            <Route path="/diner/postedEdit/:postId" element={<PostedEdit />} />

            <Route path="/post/:postId" element={<Post />} />

            <Route path="/boss" element={<Boss />}>
              <Route path="/boss/bossInfo/:companyId" element={<BossInfo />} />
              <Route
                path="/boss/bossInfoEdit/:companyId"
                element={<BossInfoEdit />}
              />
              <Route path="/boss/photo/:companyId" element={<Photo />} />
              <Route
                path="/boss/photoUpload/:companyId"
                element={<PhotoUpload />}
              />
              <Route path="/boss/openTime/:companyId" element={<OpenTime />} />
              <Route path="/boss/activity/:companyId" element={<Activity />} />
              <Route
                path="/boss/activityEdit/:companyId"
                element={<ActivityEdit />}
              />
              <Route path="/boss/table/:companyId" element={<Table />} />
              <Route path="/boss/schedule/:companyId" element={<Schedule />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </NextUIProvider>
  </React.StrictMode>,
);
