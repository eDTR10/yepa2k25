import { ThemeProvider } from "@/components/theme-provider"
import './index.css'
import { Link, Outlet, useNavigate } from "react-router-dom";
import Select from 'react-select';

// import { ModeToggle } from "./components/mode-toggle";
// import Reveal from "./components/animation/reveal";
import Logo from './assets/2025 YEPA.png'
import { useState, useRef, useEffect } from "react";
import Music from '/music.mp3'
function Rate() {

  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedVoterName, setSelectedVoterName] = useState<any>(null);
  const [isCustomVoter, setIsCustomVoter] = useState(false);
  const [customVoterName, setCustomVoterName] = useState('');

  const NAMES = [
'SITTIE RAHMA V. ALAWI',
'Raposala, Eugene III C.',
'Garde, Tricia R.',

  ];

  const nameOptions = [
    ...NAMES.map(name => ({ value: name, label: name })),
    { value: 'others', label: '+ Other (Specify)', isSpecial: true }
  ];

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      color: 'white',
      cursor: 'pointer',
      '&:hover': {
        borderColor: 'rgba(59, 130, 246, 0.5)',
      },
    }),
    input: (base: any) => ({
      ...base,
      color: 'white',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'rgba(107, 114, 128, 0.7)',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.5)' : state.isFocused ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
      color: state.data.isSpecial ? 'rgba(192, 132, 250, 1)' : 'white',
      fontWeight: state.data.isSpecial ? '600' : 'normal',
      cursor: 'pointer',
      borderTop: state.data.isSpecial ? '1px solid rgba(59, 130, 246, 0.3)' : 'none',
      paddingTop: state.data.isSpecial ? '0.75rem' : undefined,
      '&:hover': {
        backgroundColor: state.data.isSpecial ? 'rgba(147, 51, 234, 0.2)' : 'rgba(59, 130, 246, 0.2)',
      },
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: '12rem',
      display: 'flex',
      flexDirection: 'column',
    }),
  };

  // Load voter name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('voterName');
    if (savedName) {
      const option = nameOptions.find(opt => opt.value === savedName);
      if (option) {
        setSelectedVoterName(option);
        setIsCustomVoter(false);
      } else {
        setSelectedVoterName({ value: savedName, label: savedName });
        setCustomVoterName(savedName);
        setIsCustomVoter(true);
      }
    }
  }, []);

  const handleNameChange = (option: any) => {
    if (option?.value === 'others') {
      setIsCustomVoter(true);
      setSelectedVoterName(null);
      setCustomVoterName('');
    } else {
      setIsCustomVoter(false);
      setSelectedVoterName(option);
      setCustomVoterName('');
      localStorage.setItem('voterName', option?.value || '');
    }
  };

  const handleCustomNameSubmit = (destination: string) => {
    if (customVoterName.trim()) {
      localStorage.setItem('voterName', customVoterName);
      navigate(destination);
      setShowWelcome(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  const canProceed = isCustomVoter ? customVoterName.trim().length > 0 : selectedVoterName;

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
            <div className="text-center flex flex-col items-center justify-center px-4">
              <h1 className="text-4xl text-white mb-4 font-bold">Welcome to</h1>
              <img src={Logo} className="logo  w-[40%] sm:w-[100%]  " alt="Vite logo" />
              
              {/* Name Selection */}
              <div className="w-full max-w-md mt-8 mb-6">
                <label className="block text-sm font-semibold text-blue-200 mb-3">
                  Select Your Name *
                </label>
                {!isCustomVoter ? (
                  <Select
                    options={nameOptions}
                    value={selectedVoterName}
                    onChange={handleNameChange}
                    placeholder="Search or select your name..."
                    isClearable
                    isSearchable
                    styles={customSelectStyles}
                  />
                ) : (
                  <div className="flex gap-2 flex-col">
                    <input
                      type="text"
                      value={customVoterName}
                      onChange={(e) => setCustomVoterName(e.target.value)}
                      placeholder="Type your name here..."
                      className="px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={() => {
                        setIsCustomVoter(false);
                        setSelectedVoterName(null);
                        setCustomVoterName('');
                      }}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    >
                      Back to List
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => {
                  if (canProceed) {
                    if (isCustomVoter) {
                      handleCustomNameSubmit('/yepa2k25/performance/rating');
                    } else {
                      navigate('/yepa2k25/performance/rating');
                      setShowWelcome(false);
                      if (audioRef.current) {
                        audioRef.current.play();
                      }
                    }
                  }
                }}
                disabled={!canProceed}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold hover:scale-105 transition-transform mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Performance Voting
              </button>

              <button 
                onClick={() => {
                  if (canProceed) {
                    if (isCustomVoter) {
                      handleCustomNameSubmit('/yepa2k25/performance/snap');
                    } else {
                      navigate('/yepa2k25/performance/snap');
                      setShowWelcome(false);
                      if (audioRef.current) {
                        audioRef.current.play();
                      }
                    }
                  }
                }}
                disabled={!canProceed}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full font-semibold hover:scale-105 transition-transform mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
        {/* <NavLink  
        to="/yepa2k25/voting"
        text="Voting"
        />

        <NavLink
        to="/yepa2k25/snap"
        text="Snap Booth"
        /> */}



       
        </nav>
       
      </nav>
 

      

      <Outlet />
     
    </div>
    </ThemeProvider>
  )
}



export default Rate
