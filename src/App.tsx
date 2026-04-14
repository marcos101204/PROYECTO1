import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
        </Route>

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />

        {/* Fallback */}
        <Route path="*" element={<SignIn />} />
      </Routes>
    </Router>
  );
}
