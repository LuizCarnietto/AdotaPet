import { User } from "lucide-react";
import { APP_NAME } from "../constants/app.constant";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Header = (): JSX.Element => {
  const tipoUsuario = localStorage.getItem("tipoUsuario");

  

  return (
    <header className="w-full  bg-[#F8FAFC]-600 px-8 py-4 md:px-12 ">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <img src="src/images/logoMelhor.png" alt="Logo" className="w-20 h-[70px] object-contain" />
            </a>
            <div className="hidden md:flex gap-8">
              <a href="/" className="text-black hover:underline" 
              style={{ fontFamily: '"Courier New", Courier, monospace' }}>Home</a>
              <a href="/" className="text-black hover:underline" 
              style={{ fontFamily: '"Courier New", Courier, monospace' }}>Sobre</a>
              <a href="/#faq" className="text-black hover:underline" 
              style={{ fontFamily: '"Courier New", Courier, monospace' }}>F.A.Q</a>
            </div>
          </div>
          <div className="flex items-center gap-8">
              {tipoUsuario === "ROLE_ONG" && (

                <a href="/cadastros/RegistroAnimal" 
                className="bg-[#36c3ff] text-white hover:bg-[rgb(26,176,240)] transition-colors font-light rounded-[20px] text-[14px] w-[140px] h-[35px]
                flex items-center justify-center"
                style={{ fontFamily: '"Inter", sans-serif' }}>
                  Registrar Animal
                </a>
              )}
          <Button variant="secondary" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
          </div>
        </nav>
      </header>
  );
};
