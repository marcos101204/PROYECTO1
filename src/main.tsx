import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";

// Importación de tus páginas
import Home from "./pages/Dashboard/Home.tsx";
import Home2 from "./pages/Dashboard/Home2.tsx";
import SignIn from "./pages/AuthPages/SignIn.tsx";
import HomeAdmin from "./pages/Dash_Admin/HomeAdmin.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AppWrapper>
      <BrowserRouter>
        <Routes>
          {/* Esta es la ruta que carga al entrar a localhost:5173 */}
          <Route path="/" element={<Home />} />


          {/* Estas son las rutas a las que haces navigate() */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/Home2" element={<Home2 />} />
          <Route path="/HomeAdmin" element={<HomeAdmin />} />
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  </StrictMode>
);