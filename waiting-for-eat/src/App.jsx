import { BrowserRouter, Route, Routes } from "react-router-dom";
import Calendar from "./pages/Calendar";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Editor from "./pages/Post/TextEditor";
import Search from "./pages/Search";
import Test from "./pages/test";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/post" element={<Post />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
