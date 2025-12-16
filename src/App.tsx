import { ThemeProvider } from "@/components/theme-provider"

import { Link, Outlet } from "react-router-dom";

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";
import Logo from './assets/2025 YEPA.png'

function App() {


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
     <div className=" min-h-screen w-full overflow-hidden flex flex-col  items-center">
      
      <nav className=" animate__animated animate__slideInDown  z-20  fixed flex justify-between items-start w-full max-w-[1468px] py-5 border-b-[0px] border-accent  ">
        <Link className=" ml-5" to="/react-vite-supreme" >
          <img src={Logo} className="logo sm:hidden h-[100px] object-contain " alt="Vite logo" />
        </Link>
        {/* <nav className=" text-accent-foreground flex gap-10 uppercase items-center">
        <NavLink
        to="/react-vite-supreme/page1"
        text="Voting"
        />

        <NavLink
        to="/react-vite-supreme/page2"
        text="ABOUT US"
        />



       
        </nav> */}
       
      </nav>
 

      

      <Outlet />
     
    </div>
    </ThemeProvider>
  )
}



export default App
