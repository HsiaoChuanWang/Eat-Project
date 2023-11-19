import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Admin from "./pages/Admin";
import Search from "./pages/Search";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/search" element={<Search />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
