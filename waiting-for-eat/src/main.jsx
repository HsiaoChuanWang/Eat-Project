import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Boss from "./pages/Boss";
import Diner from "./pages/Diner";
import PostedEdit from "./pages/Diner/PostedEdit.jsx";
import Star from "./pages/Diner/Star.jsx";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Post from "./pages/Post";
import TextEditor from "./pages/Post/TextEditor.jsx";
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
          <Route path="/diner/:userId" element={<Diner />} />
          <Route path="/editor/:orderId" element={<TextEditor />} />
          <Route path="/comment/:orderId" element={<Star />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="/postedEdit/:postId" element={<PostedEdit />} />
          <Route path="/boss/:companyId" element={<Boss />} />
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </NextUIProvider>,
  //   </React.StrictMode>,
);
