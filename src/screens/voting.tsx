import { ChevronLeft, ChevronRight, Star, Building2Icon } from 'lucide-react';
import { useState } from 'react';
import './../index.css'
import IMGSample1 from '/576932793_1586869122654411_2781440902001805892_n.jpg'
import IMGSample2 from '/565097823_1106031588362675_2331175491752899233_n.jpg'
import BG from './../assets/bg-stars.webp'
const menCards = [
  {
    id: 1,
    title: "Mohammed Al-Rashid",
    location: "Regional Office",
    age: 4.9,
    image: IMGSample1,
    description: "Charismatic and dignified Arabian Prince",
    date: "Dec 2024"
  },
  {
    id: 2,
    title: "Ahmed Hassan",
    location: "Bukidnon Provincial Office",
    age: 4.8,
    image: IMGSample1,
    description: "Elegant and sophisticated Arabian Prince",
    date: "Jan 2025"
  },
  {
    id: 3,
    title: "Karim Mansouri",
    location: "Camiguin Provincial Office",
    age: 4.9,
    image: IMGSample1,
    description: "Charming and graceful Arabian Prince",
    date: "Feb 2025"
  },
  {
    id: 4,
    title: "Hassan Al-Zahra",
    location: "Misamis Oriental Provincial Office",
    age: 5.0,
    image: IMGSample1,
    description: "Noble and distinguished Arabian Prince",
    date: "Mar 2025"
  },
  {
    id: 5,
    title: "Ibrahim Al-Noor",
    location: "Misamis Occidental Provincial Office",
    age: 4.7,
    image: IMGSample1,
    description: "Radiant and impressive Arabian Prince",
    date: "Apr 2025"
  }
];

const womenCards = [
  {
    id: 6,
    title: "Fatima Al-Saada",
    location: "Lanao del Norte Provincial Office",
    age: 4.9,
    image:  IMGSample2,
    description: "Graceful and beautiful Arabian Princess",
    date: "Dec 2024"
  },
  {
    id: 7,
    title: "Aisha Al-Zahra",
    location: "Iligan City Office",
    age: 5.0,
    image:  IMGSample2,
    description: "Radiant and elegant Arabian Princess",
    date: "Jan 2025"
  },
  {
    id: 8,
    title: "Noor Al-Amira",
    location: "Regional Office",
    age: 4.8,
    image:  IMGSample2,
    description: "Luminous and captivating Arabian Princess",
    date: "Feb 2025"
  },
  {
    id: 9,
    title: "Layla Mansouri",
    location: "Bukidnon Provincial Office",
    age: 4.9,
    image: IMGSample2,
    description: "Enchanting and majestic Arabian Princess",
    date: "Mar 2025"
  },
  {
    id: 10,
    title: "Yasmin Al-Karim",
    location: "Camiguin Provincial Office",
    age: 4.7,
    image: IMGSample2,
    description: "Stunning and remarkable Arabian Princess",
    date: "Apr 2025"
  },
  {
    id: 9,
    title: "Layla Mansouri",
    location: "Bukidnon Provincial Office",
    age: 4.9,
    image: IMGSample2,
    description: "Enchanting and majestic Arabian Princess",
    date: "Mar 2025"
  },
  {
    id: 10,
    title: "Yasmin Al-Karim",
    location: "Camiguin Provincial Office",
    age: 4.7,
    image: IMGSample2,
    description: "Stunning and remarkable Arabian Princess",
    date: "Apr 2025"
  },
  {
    id: 9,
    title: "Layla Mansouri",
    location: "Bukidnon Provincial Office",
    age: 4.9,
    image: IMGSample2,
    description: "Enchanting and majestic Arabian Princess",
    date: "Mar 2025"
  },
  {
    id: 10,
    title: "Yasmin Al-Karim",
    location: "Camiguin Provincial Office",
    age: 4.7,
    image: IMGSample2,
    description: "Stunning and remarkable Arabian Princess",
    date: "Apr 2025"
  }
];

export default function Voting() {
 const [currentIndex, setCurrentIndex] = useState(0);
  const [_direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [gender, setGender] = useState('men');
  const [votes, setVotes] = useState<{[key: number]: boolean}>({});

  const cards = gender === 'men' ? menCards : womenCards;

  const handleVote = (cardId: number) => {
    
  
    const isManCard = menCards.some(c => c.id === cardId);
    
    // If unvoting, allow it
    if (votes[cardId]) {
      setVotes((prev) => ({
        ...prev,
        [cardId]: false
      }));
      return;
    }

    // If voting, check if already has a vote in this gender
    if (isManCard) {
      const hasManVote = getMenVotes().length > 0;
      if (hasManVote) return; // Can't vote, already has a man vote
    } else {
      const hasWomanVote = getWomenVotes().length > 0;
      if (hasWomanVote) return; // Can't vote, already has a woman vote
    }

    // Vote allowed
    setVotes((prev) => ({
      ...prev,
      [cardId]: true
    }));
  };

  const getMenVotes = () => menCards.filter(card => votes[card.id]);
  const getWomenVotes = () => womenCards.filter(card => votes[card.id]);
  const hasCompletedVoting = getMenVotes().length === 1 && getWomenVotes().length === 1;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleDragStart = (e:any) => {
    setIsDragging(true);
    setStartX(e.type === 'mousedown' ? e.clientX : e.touches[0].clientX);
  };

  const handleDragMove = (e:any) => {
    if (!isDragging) return;
    
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Threshold for slide change (100px)
    if (dragOffset > 100) {
      prevSlide();
    } else if (dragOffset < -100) {
      nextSlide();
    }
    
    setDragOffset(0);
  };

  const getCardStyle = (index:any) => {
    const absIndex = (index - currentIndex + cards.length) % cards.length;
    
    // Apply drag offset to the active card
    const dragTransform = absIndex === 0 ? `translateX(${dragOffset * 0.5}px)` : '';
    
    if (absIndex === 0) {
      return {
        transform: `${dragTransform} scale(1) rotateY(0deg)`,
        opacity: 1,
        zIndex: 50,
        filter: 'blur(0px)',
        transition: isDragging ? 'none' : 'all 0.7s ease-out'
      };
    } else if (absIndex === 1) {
      return {
        transform: `translateX(${90 + (dragOffset * 0.3)}%) scale(0.88) rotateY(-20deg)`,
        opacity: 0.85,
        zIndex: 40,
        filter: 'blur(0.5px)',
        transition: isDragging ? 'none' : 'all 0.7s ease-out'
      };
    } else if (absIndex === 2) {
      return {
        transform: `translateX(${160 + (dragOffset * 0.2)}%) scale(0.76) rotateY(-35deg)`,
        opacity: 0.7,
        zIndex: 30,
        filter: 'blur(1px)',
        transition: isDragging ? 'none' : 'all 0.7s ease-out'
      };
    } else if (absIndex === cards.length - 1) {
      return {
        transform: `translateX(${-90 + (dragOffset * 0.3)}%) scale(0.88) rotateY(20deg)`,
        opacity: 0.85,
        zIndex: 40,
        filter: 'blur(0.5px)',
        transition: isDragging ? 'none' : 'all 0.7s ease-out'
      };
    } else if (absIndex === cards.length - 2) {
      return {
        transform: `translateX(${-160 + (dragOffset * 0.2)}%) scale(0.76) rotateY(35deg)`,
        opacity: 0.7,
        zIndex: 30,
        filter: 'blur(1px)',
        transition: isDragging ? 'none' : 'all 0.7s ease-out'
      };
    } else {
      return {
        transform: `scale(0.6) rotateY(0deg)`,
        opacity: 0,
        zIndex: 10,
        filter: 'blur(3px)',
        transition: isDragging ? 'none' : 'all 0.7s ease-out'
      };
    }
  };

  return (
    <div className=" relative min-h-screen pt-5 pb-10 w-screen overflow-hidden flex items-center justify-center p-0   bg-[#040b35]" >


      <div className=' z-0 absolute w-[400vw] h-full pointer-events-none '>

        <img src={BG} className=' absolute z-0 h-[80vh] stars ' alt="" />

      </div>
      
    
         
    
      <div className="w-screen overflow-hidden  ">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-4xl sm:text-2xl text-[#ffcc75] font-extrabold mb-2 sm:mb-4 px-4">
Mr. and Ms. Best Dresse          </h1>

          <p className="text-blue-200 text-base sm:text-base px-4 mb-6">Vote for your favorite Arabian Prince and Princess this night</p>

          {/* Gender Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg font-semibold transition-colors ${gender === 'men' ? 'text-white' : 'text-gray-400'}`}>
              Prince
            </span>
            <button
              onClick={() => {
                setGender(gender === 'men' ? 'women' : 'men');
                setCurrentIndex(0);
              }}
              className="relative inline-flex cursor-pointer h-5 w-14 items-center rounded-full transition-colors"
              style={{
                background: gender === 'men' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(147, 51, 234, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                style={{
                  transform: gender === 'women' ? 'translateX(36px)' : 'translateX(2px)',
                }}
              />
            </button>
            <span className={`text-lg font-semibold transition-colors ${gender === 'women' ? 'text-white' : 'text-gray-400'}`}>
              Princess
            </span>
          </div>
        </div>

        {/* Slider Container */}
        {!hasCompletedVoting && (
        <div 
          className="relative h-[320px] sm:h-[400px] flex items-center justify-center" 
          style={{ perspective: '2000px' }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Cards */}
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="absolute h-[98%]  w-[290px] sm:w-[280px] "
              style={{
                ...getCardStyle(index),
                transformStyle: 'preserve-3d',
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
              {/* Glass Card */}
              <div 
                className="w-full h-full rounded-2xl sm:rounded-2xl overflow-hidden relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* Image */}
                <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute top-0 left-0 right-0 h-48 sm:h-56 md:h-64"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(4,11,53,0) 0%, rgba(4,11,53,0.4) 100%)'
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-2 md:p-2 relative">
                  {/* Rating Badge */}
                  <div 
                    className="absolute -top-10 right-5  px-1 py-1 w-[50px] rounded-full flex items-center gap-1.5 sm:gap-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold text-sm sm:text-sm">{card.age}</span>
                  </div>

                  <h3 className="text-xl sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">{card.title}</h3>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <Building2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
                    <span className="text-blue-200 text-xs sm:text-xs">{card.location}</span>
                  </div>
{/* 
                  <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg leading-relaxed">{card.description}</p> */}

                  <div className="flex items-center justify-center">
                    
                    <button 
                      className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer hover:scale-105 text-sm sm:text-base"
                      onClick={()=>{
                        handleVote(card.id);
                      }}
                      style={{
                        background: votes[card.id] 
                          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.6) 100%)'
                          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: votes[card.id] ? '1px solid rgba(34, 197, 94, 0.6)' : '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }}
                    >
                      {votes[card.id] ? '✓ Voted' : 'Vote'}
                    </button>
                  </div>
                </div>

                {/* Shine Effect */}
                <div 
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                    backgroundSize: '200% 200%',
                    animation: 'shine 3s infinite'
                  }}
                />
              </div>
            </div>
          ))}

          {/* Navigation Buttons - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-0 z-40 p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-0 z-40 p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
        )}

        {/* Votes Summary */}
        <div className="mt-8 sm:mt-12 px-4">
          {hasCompletedVoting && (
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">✨ Voting Complete! ✨</h2>
              <p className="text-green-400 text-lg">You have successfully voted for your favorites!</p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 max-w-4xl mx-auto">
            {/* Prince Votes */}
            <div 
              className="p-4 sm:p-6 rounded-2xl cursor-pointer"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}

              onClick={
                ()=>{
                  setGender(getMenVotes().length > 0 ? gender : 'men');
                setCurrentIndex(0);
                }
              }
            >
              <h3 className="text-lg sm:text-xl font-bold text-blue-300 mb-4">👨 Prince Votes ({getMenVotes().length})</h3>
              {getMenVotes().length > 0 ? (
                <div className="space-y-3">
                  {getMenVotes().map((card) => (
                    <div key={card.id} className="flex items-center gap-3 p-3 rounded-lg" style={{background: 'rgba(255, 255, 255, 0.05)'}}>
                      <div className="relative rounded-xl overflow-hidden" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03)'
                      }}>
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{card.title}</p>
                        <p className="text-blue-200 text-sm">{card.location}</p>
                      </div>
                      <button
                        onClick={() => handleVote(card.id)}
                        className="text-xs px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No votes yet</p>
              )}
            </div>

            {/* Princess Votes */}
            <div 
              className="p-4 sm:p-6 rounded-2xl cursor-pointer"
              style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
              }}
               onClick={
                ()=>{
                  setGender(getMenVotes().length > 1 ? gender : 'women');
                setCurrentIndex(0);
                }
              }
            >
              <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-4">👩 Princess Votes ({getWomenVotes().length})</h3>
              {getWomenVotes().length > 0 ? (
                <div className="space-y-3">
                  {getWomenVotes().map((card) => (
                    <div key={card.id} className="flex items-center gap-3 p-3 rounded-lg" style={{background: 'rgba(255, 255, 255, 0.05)'}}>
                      <div className="relative rounded-xl overflow-hidden" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03)'
                      }}>
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{card.title}</p>
                        <p className="text-purple-200 text-sm">{card.location}</p>
                      </div>
                      <button
                        onClick={() => handleVote(card.id)}
                        className="text-xs px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors whitespace-nowrap"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No votes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}