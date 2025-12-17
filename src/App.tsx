import { ThemeProvider } from "@/components/theme-provider"
import './index.css'
import { Link, Outlet, useNavigate } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";
import Logo from './assets/2025 YEPA.png'
import { useState, useRef, } from "react";
import Music from '/music.mp3'
import NavLink from "./components/link/link";
function App() {

  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
// const stars = useMemo(() => Array.from({length: 100}, (_, i) => ({
//     id: i,
//     left: `${Math.random() * 100}%`,
//     top: `${Math.random() * 100}%`,
//     delay: `${Math.random() * 2}s`,
//     size: `${1 + Math.random() * 2}px`
//   })), []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     <div className=" min-h-screen w-full overflow-hidden flex flex-col  items-center bg-[#040b35]">

 

      {/* Welcome Screen */}
      <div className="fixed inset-0 z-50 flex pointer-events-none">
        <div className={`w-1/2 bg-[#040b35] transition-transform duration-1000 ${showWelcome ? 'translate-x-0' : '-translate-x-full'}`}></div>
        <div className={`w-1/2 bg-[#040b35] transition-transform duration-1000 ${showWelcome ? 'translate-x-0' : 'translate-x-full'}`}></div>
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <div className="text-center flex flex-col items-center justify-center">
              <h1 className="text-4xl text-white mb-4 font-bold">Welcome to</h1>
              <img src={Logo} className="logo  w-[40%] sm:w-[100%]  " alt="Vite logo" />
              
              
              <button 
                onClick={() => {
                  navigate('/yepa2k25/voting');
                  setShowWelcome(false);
                  if (audioRef.current) {
                    audioRef.current.play();
                  }
                }} 
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold hover:scale-105 transition-transform mt-8"
              >
                Mr and Ms YEPA 2025
              </button>

              <button 
                onClick={() => {
                  navigate('/yepa2k25/snap');
                  setShowWelcome(false);
                  if (audioRef.current) {
                    audioRef.current.play();
                  }
                }} 
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold hover:scale-105 transition-transform mt-8"
              >
                Photo Booth
              </button>
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} className=" music " src={Music} loop></audio>
      
      <nav className=" animate__animated animate__slideInDown  z-20  fixed flex justify-between sm:justify-center items-start w-full max-w-[1468px] py-5 border-b-[0px] border-accent pointer-events-none  sm:fixed sm:bottom-2  ">
        <Link className=" ml-5" to="/react-vite-supreme" >
          <img src={Logo} className="logo sm:hidden h-[100px] object-contain " alt="Vite logo" />
        </Link>
        <nav className=" text-accent-foreground flex gap-10 uppercase items-center pointer-events-auto md:w-full justify-center ">
        <NavLink  
        to="/yepa2k25/voting"
        text="Voting"
        />

        <NavLink
        to="/yepa2k25/snap"
        text="Snap Booth"
        />



       
        </nav>
       
      </nav>
 

      

      <Outlet />
     
    </div>
    </ThemeProvider>
  )
}



export default App
