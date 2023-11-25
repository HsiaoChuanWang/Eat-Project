import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Calendar from "./pages/Calendar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Editor from "./pages/Post/TextEditor";
import Search from "./pages/Search";
import Test from "./pages/test";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes path="/" element={<App />}>
        <Route index element={<Homepage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/post" element={<Post />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
