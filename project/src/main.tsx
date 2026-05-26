import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";

// Importación de tus páginas
import Home from "./pages/Dashboard/Home.tsx";
import Home2 from "./pages/Dashboard/Home2.tsx";
import SignIn from "./pages/AuthPages/SignIn.tsx";
import HomeAdmin from "./pages/Dash_Admin/HomeAdmin.tsx";
import AppLayout from "./layout/AppLayout.tsx";
import SignUp from "./pages/AuthPages/SignUp.tsx";
import Profile from "./pages/Dashboard/Profile.tsx";
import MisPublicaciones from "./pages/Dashboard/MisPublicaciones.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import Publicar from "./pages/Dashboard/Publicar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <AppWrapper>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            {/* Esta es la ruta que carga al entrar */}
            <Route path="/" element={<Home />} />
            <Route path="/Home2" element={<Home2 />} />
            <Route path="/mi-perfil" element={<Profile />} />
            <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
            <Route path="/HomeAdmin" element={<HomeAdmin />} />
            <Route path="/publicar" element={<Publicar />} />
          </Route>

          {/* Autenticación fuera del layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  </StrictMode>
);