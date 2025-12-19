import { useEffect, useState, useMemo } from 'react';
import { Trophy, X, Users } from 'lucide-react';
import './../index.css'
import BG from './../assets/bg-stars.webp'
import axios from './../plugin/axios'

interface RankingCandidate {
  id: number;
  title: string;
  location: string;
  age: number;
  gender: 'M' | 'F';
  image: string;
  votes: number;
  voters: string[];
}

interface PerformerRanking {
  performer: {
    id: number;
    name: string;
    photo: string;
  };
  average_total_score: number;
  total_ratings: number;
  average_scores?: {
    Talent: number;
    Creativity: number;
    'Stage Presence': number;
    'Relevance of ICT': number;
    'Time Adherence': number;
    average_total: number;
  };
  ratings?: Array<{
    id: number;
    rater: string;
    ratings: number[];
    total_score: number;
  }>;
}

export default function Ranking() {
  const [mrRanking, setMrRanking] = useState<RankingCandidate[]>([]);
  const [msRanking, setMsRanking] = useState<RankingCandidate[]>([]);
  const [performerRanking, setPerformerRanking] = useState<PerformerRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'mr' | 'ms' | 'performers'>('mr');
  const [selectedCandidate, setSelectedCandidate] = useState<RankingCandidate | null>(null);
  const [selectedPerformer, setSelectedPerformer] = useState<PerformerRanking | null>(null);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);

  const stars = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    size: `${1 + Math.random() * 2}px`
  })), []);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const [votingResponse, performerResponse] = await Promise.all([
          axios.get('/api/v1/vote/ranking/'),
          axios.get('/api/v1/rate/ranking/')
        ]);
        
        setMrRanking(votingResponse.data.mr_ranking || []);
        setMsRanking(votingResponse.data.ms_ranking || []);
        setPerformerRanking(performerResponse.data.ranking || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch ranking data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const getRankingColor = (index: number) => {
    if (index === 0) return { bg: 'rgba(255, 215, 0, 0.15)', border: 'rgba(255, 215, 0, 0.4)', text: 'text-yellow-300' };
    if (index === 1) return { bg: 'rgba(192, 192, 192, 0.15)', border: 'rgba(192, 192, 192, 0.4)', text: 'text-gray-300' };
    if (index === 2) return { bg: 'rgba(205, 127, 50, 0.15)', border: 'rgba(205, 127, 50, 0.4)', text: 'text-orange-300' };
    return { bg: 'rgba(100, 150, 255, 0.1)', border: 'rgba(100, 150, 255, 0.3)', text: 'text-blue-300' };
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const handleViewPerformerDetails = async (performer: PerformerRanking) => {
    setSelectedPerformer(performer);
    setLoadingBreakdown(true);
    
    try {
      const response = await axios.get(`/api/v1/rate/performer-scores/${performer.performer.id}/`);
      setSelectedPerformer(response.data);
    } catch (err) {
      console.error('Failed to fetch performer scores:', err);
    } finally {
      setLoadingBreakdown(false);
    }
  };

  const currentRanking = activeTab === 'mr' ? mrRanking : msRanking;
  const tabTitle = activeTab === 'mr' ? 'Mr. Best Dressed' : 'Ms. Best Dressed';

  return (
    <div className="relative min-h-screen pt-5 pb-10 w-screen overflow-hidden flex items-center justify-center p-0 bg-[#040b35]">
      {/* Background */}
      <div className='z-0 absolute w-[400vw] h-full pointer-events-none'>
        <img src={BG} className='absolute z-[-1] h-[80vh] stars' alt="" />
        <div className="stars-container">
          {stars.map((star) => (
            <div key={star.id} className="star" style={{ left: star.left, top: star.top, animationDelay: star.delay, width: star.size, height: star.size }}></div>
          ))}
        </div>
        <div className="moon"></div>
      </div>

      <div className="w-screen overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-4xl sm:text-3xl text-[#ffcc75] font-extrabold mb-2 sm:mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
            Live Rankings
          </h1>
          <p className="text-blue-200 text-base sm:text-lg">Vote count updated in real-time</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-4 mb-8 px-4 flex-wrap">
          <button
            onClick={() => setActiveTab('mr')}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300"
            style={{
              background: activeTab === 'mr' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(147, 51, 234, 0.6) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'mr' 
                ? '1px solid rgba(59, 130, 246, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            Prince
          </button>
          <button
            onClick={() => setActiveTab('ms')}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300"
            style={{
              background: activeTab === 'ms' 
                ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.6) 0%, rgba(236, 72, 153, 0.6) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'ms' 
                ? '1px solid rgba(147, 51, 234, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            Princess
          </button>
          <button
            onClick={() => setActiveTab('performers')}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300"
            style={{
              background: activeTab === 'performers' 
                ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(168, 85, 247, 0.6) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'performers' 
                ? '1px solid rgba(236, 72, 153, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            🎭 Performance
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Loading rankings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {/* Rankings List */}
        {!loading && !error && (
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            {/* Candidate Rankings */}
            {(activeTab === 'mr' || activeTab === 'ms') && (
              <>
                {currentRanking.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No votes yet for {tabTitle}</p>
                  </div>
                ) : (
                  currentRanking.map((candidate, index) => {
                    const colors = getRankingColor(index);
                    const medal = getMedalIcon(index);

                    return (
                      <div
                        key={candidate.id}
                        className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all hover:scale-102"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          {typeof medal === 'string' && medal.includes('�') ? (
                            <span className="text-2xl sm:text-3xl">{medal}</span>
                          ) : (
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${colors.text}`}
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: `1px solid ${colors.border}`
                              }}
                            >
                              {medal}
                            </div>
                          )}
                        </div>

                        {/* Candidate Image */}
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <img
                            src={`https://zipfile.pythonanywhere.com/${candidate.image}`}
                            alt={candidate.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Candidate Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white truncate">{candidate.title}</h3>
                          <p className="text-blue-200 text-sm sm:text-base mb-1">{candidate.location}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">Age: {candidate.age}</p>
                        </div>

                        {/* Vote Count */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{candidate.votes}</div>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {candidate.votes === 1 ? 'vote' : 'votes'}
                          </p>
                        </div>

                        {/* View Voters Button */}
                        <button
                          onClick={() => setSelectedCandidate(candidate)}
                          className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-all hover:scale-105 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                          style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white'
                          }}
                        >
                          <Users className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </>
            )}

            {/* Performer Rankings */}
            {activeTab === 'performers' && (
              <>
                {performerRanking.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No ratings yet</p>
                  </div>
                ) : (
                  performerRanking.map((item, index) => {
                    const colors = getRankingColor(index);
                    const medal = getMedalIcon(index);

                    return (
                      <div
                        key={item.performer.id}
                        className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl transition-all hover:scale-102"
                        style={{
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          {typeof medal === 'string' && medal.includes('�') ? (
                            <span className="text-2xl sm:text-3xl">{medal}</span>
                          ) : (
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl ${colors.text}`}
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: `1px solid ${colors.border}`
                              }}
                            >
                              {medal}
                            </div>
                          )}
                        </div>

                        {/* Performer Image */}
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <img
                            src={`https://zipfile.pythonanywhere.com${item.performer.photo}`}
                            alt={item.performer.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Performer Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-white truncate">{item.performer.name}</h3>
                          <p className="text-purple-300 text-sm sm:text-base">Performance Battle</p>
                        </div>

                        {/* Score */}
                        <div className="flex-shrink-0 text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-white">{item.average_total_score.toFixed(1)}</div>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {item.total_ratings === 1 ? 'rating' : 'ratings'} ({item.total_ratings})
                          </p>
                        </div>

                        {/* View Breakdown Button */}
                        <button
                          onClick={() => handleViewPerformerDetails(item)}
                          className="flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg transition-all hover:scale-105 text-xs sm:text-sm font-semibold flex items-center gap-1.5"
                          style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white'
                          }}
                        >
                          <Users className="w-4 h-4" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 sm:mt-16 px-4 max-w-3xl mx-auto text-center">
          <div className="p-4 sm:p-6 rounded-2xl"
            style={{
              background: 'rgba(100, 150, 255, 0.1)',
              border: '1px solid rgba(100, 150, 255, 0.3)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <p className="text-gray-300 text-sm sm:text-base">
              Rankings are updated in real-time as votes are cast. 
              <span className="block mt-2 text-blue-300">Go back to voting to cast your vote!</span>
            </p>
          </div>
        </div>
      </div>

      {/* Voters Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a1535] rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col border border-cyan-500/30"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03)'
            }}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-cyan-500/20 flex items-center justify-between bg-[#0a1535]/95 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-cyan-500/30">
                  <img
                    src={`https://zipfile.pythonanywhere.com/${selectedCandidate.image}`}
                    alt={selectedCandidate.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">{selectedCandidate.title}</h3>
                  <p className="text-xs sm:text-sm text-cyan-300">{selectedCandidate.votes} {selectedCandidate.votes === 1 ? 'vote' : 'votes'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="flex-shrink-0 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Voters List - Scrollable */}
            <div className="p-4 sm:p-6 space-y-2 overflow-y-auto flex-1">
              {selectedCandidate.voters && selectedCandidate.voters.length > 0 ? (
                selectedCandidate.voters.map((voter, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg flex items-center gap-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(100, 200, 255, 0.2)',
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6))'
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="text-white text-sm sm:text-base truncate">{voter}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No voters yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Breakdown Modal */}
      {selectedPerformer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a1535] rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col border border-pink-500/30"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03)'
            }}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-pink-500/20 flex items-center justify-between bg-[#0a1535]/95 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-pink-500/30">
                  <img
                    src={`https://zipfile.pythonanywhere.com${selectedPerformer.performer.photo}`}
                    alt={selectedPerformer.performer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">{selectedPerformer.performer.name}</h3>
                  <p className="text-xs sm:text-sm text-pink-300">Score Breakdown</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPerformer(null)}
                className="flex-shrink-0 p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Breakdown Content - Scrollable */}
            <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
              {loadingBreakdown ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">Loading breakdown...</p>
                </div>
              ) : selectedPerformer.average_scores ? (
                <>
                  {/* Criteria Breakdown */}
                  <div className="space-y-3">
                    {[
                      { name: 'Talent', key: 'Talent', max: 30 },
                      { name: 'Creativity', key: 'Creativity', max: 20 },
                      { name: 'Stage Presence', key: 'Stage Presence', max: 20 },
                      { name: 'Relevance of ICT', key: 'Relevance of ICT', max: 15 },
                      { name: 'Time Adherence', key: 'Time Adherence', max: 15 }
                    ].map((criterion) => {
                      const score = (selectedPerformer.average_scores as any)[criterion.key];
                      const percentage = (score / criterion.max) * 100;
                      
                      return (
                        <div key={criterion.key} className="p-3 rounded-lg" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(236, 72, 153, 0.2)',
                        }}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-semibold text-sm">{criterion.name}</span>
                            <span className="text-pink-300 font-bold">{score}/{criterion.max}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{percentage.toFixed(0)}%</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total Summary */}
                  <div className="p-3 rounded-lg mt-4 border-t border-pink-500/20 pt-4"
                    style={{
                      background: 'rgba(236, 72, 153, 0.1)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">Average Total Score</span>
                      <span className="text-yellow-300 text-2xl font-bold">{selectedPerformer.average_scores.average_total.toFixed(1)}/100</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Based on {selectedPerformer.total_ratings} {selectedPerformer.total_ratings === 1 ? 'rating' : 'ratings'}</p>
                  </div>

                  {/* Judge Ratings */}
                  {selectedPerformer.ratings && selectedPerformer.ratings.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-pink-500/20 space-y-2">
                      <h4 className="text-white font-bold text-sm">Judge Ratings</h4>
                      {selectedPerformer.ratings.map((rating) => (
                        <div key={rating.id} className="p-2 rounded-lg" style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(236, 72, 153, 0.15)',
                        }}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-pink-300 font-semibold text-sm">{rating.rater}</span>
                            <span className="text-yellow-300 font-bold text-sm">{rating.total_score}/100</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1 text-xs">
                            {[
                              { key: 'Talent', name: 'T' },
                              { key: 'Creativity', name: 'C' },
                              { key: 'Stage Presence', name: 'SP' },
                              { key: 'Relevance of ICT', name: 'ICT' },
                              { key: 'Time Adherence', name: 'TA' }
                            ].map((criteria, idx) => (
                              <div key={criteria.key} className="text-center text-gray-400">
                                <div className="text-cyan-300 font-bold">{rating.ratings[idx]}</div>
                                <div className="text-xs">{criteria.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No score data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: blink 2s infinite;
        }
        .moon {
          position: absolute;
          top: 10%;
          left: 10%;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle at 25% 25%, transparent 35%, #ffeb3b 36%, #ffeb3b 65%, transparent 66%);
          border-radius: 50%;
          opacity: 0.7;
          box-shadow: 0 0 20px rgba(255, 235, 59, 0.5);
        }
      `}</style>
    </div>
  );
}
