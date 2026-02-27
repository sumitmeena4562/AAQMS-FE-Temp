import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import LandingPage from "./pages/Home/LandingPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
