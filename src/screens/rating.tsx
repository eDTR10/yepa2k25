import { useState, useEffect, useMemo } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from './../plugin/axios'

interface Performer {
  id: number;
  name: string;
  photo: string;
}

interface Rating {
  id: number;
  performer: number;
  rater: string;
  ratings: number[];
  total_score: number;
}

interface PerformerScore {
  performer: Performer;
  ratings: Rating[];
  average_scores: {
    Talent: number;
    Creativity: number;
    'Stage Presence': number;
    'Relevance of ICT': number;
    'Time Adherence': number;
    average_total: number;
  };
}

const CRITERIA = [
  { name: 'Talent', description: 'Skill level, technique, and overall performance quality', points: 30 },
  { name: 'Creativity', description: 'Originality of the act, unique ideas, and innovative approach', points: 20 },
  { name: 'Stage Presence', description: 'Confidence, charisma, and ability to engage the audience', points: 20 },
  { name: 'Relevance of ICT', description: 'Effective integration of ICT in the performance', points: 15 },
  { name: 'Time Adherence', description: 'Staying within the 2-3 minute time limit', points: 15 }
];

export default function Rating() {
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState('');
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [ratings, setRatings] = useState<number[]>([0, 0, 0, 0, 0]);
  const [performerScores, setPerformerScores] = useState<Map<number, PerformerScore>>(new Map());
  const [editingRatingId, setEditingRatingId] = useState<number | null>(null);
  const [expandedPerformer, setExpandedPerformer] = useState<number | null>(null);

  const stars = useMemo(() => Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    size: `${1 + Math.random() * 2}px`
  })), []);

  useEffect(() => {
    fetchPerformers();
    // Get judge name from localStorage
    // const voterName = localStorage.getItem('voterName');
    // if (voterName) {
    //   setRaterName(voterName);
    // }
  }, []);

  const fetchPerformers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/rate/performers/');
      setPerformers(Array.isArray(response.data) ? response.data : []);
      
      // Fetch scores for all performers
      if (Array.isArray(response.data)) {
        response.data.forEach((performer: Performer) => {
          fetchPerformerScores(performer.id);
        });
      }
    } catch (err) {
      setError('Failed to fetch performers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformerScores = async (performerId: number) => {
    try {
      const response = await axios.get(`/api/v1/rate/performer-scores/${performerId}/`);
      setPerformerScores(prev => new Map(prev).set(performerId, response.data));
    } catch (err) {
      console.error(`Failed to fetch scores for performer ${performerId}`, err);
    }
  };

  const handleRatingChange = (index: number, value: number) => {
    const maxPoints = CRITERIA[index].points;
    if (value <= maxPoints && value >= 0) {
      const newRatings = [...ratings];
      newRatings[index] = value;
      setRatings(newRatings);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const voterName = localStorage.getItem('voterName');
    
    if (!selectedPerformer || !voterName) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please select a performer and ensure you have a voter name set',
        confirmButtonColor: '#040b35',
        background: '#0a1535',
        color: '#ffffff'
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        performer_id: selectedPerformer.id,
        rater: voterName,
        ratings: ratings
      };

      if (editingRatingId) {
        await axios.put(`/api/v1/rate/ratings/${editingRatingId}/`, {
          performer: selectedPerformer.id,
          rater: voterName,
          ratings: ratings
        });
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Rating updated successfully!',
          confirmButtonColor: '#040b35',
          background: '#0a1535',
          color: '#ffffff'
        });
        setEditingRatingId(null);
      } else {
        await axios.post('/api/v1/rate/submit-rating/', payload);
        Swal.fire({
          icon: 'success',
          title: 'Submitted!',
          text: 'Rating submitted successfully!',
          confirmButtonColor: '#040b35',
          background: '#0a1535',
          color: '#ffffff'
        });
      }

      // Refresh scores
      await fetchPerformerScores(selectedPerformer.id);
      
      // Reset form
      setRatings([0, 0, 0, 0, 0]);
      setSelectedPerformer(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || 'Failed to submit rating';
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonColor: '#040b35',
        background: '#0a1535',
        color: '#ffffff'
      });
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRating = (rating: Rating) => {
    const performer = performers.find(p => p.id === rating.performer);
    setSelectedPerformer(performer || null);
    // setRaterName(rating.rater);
    setRatings(rating.ratings);
    setEditingRatingId(rating.id);
  };

  const handleDeleteRating = async (ratingId: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this rating!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#040b35',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#0a1535',
      color: '#ffffff'
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      await axios.delete(`/api/v1/rate/ratings/${ratingId}/`);
      
      // Refresh all performer scores
      performers.forEach(p => fetchPerformerScores(p.id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Rating deleted successfully!',
        confirmButtonColor: '#040b35',
        background: '#0a1535',
        color: '#ffffff'
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete rating';
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonColor: '#040b35',
        background: '#0a1535',
        color: '#ffffff'
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

//   const handleCancel = () => {
//     setRatings([0, 0, 0, 0, 0]);
//     setSelectedPerformer(null);
//     setEditingRatingId(null);
//   };

  const totalPoints = ratings.reduce((sum, val) => sum + val, 0);

  return (
    <div className="relative min-h-screen pt-5 pb-10 w-screen overflow-hidden flex items-center justify-center p-0 bg-transparent">
      {/* Background */}
      <div className='z-0 absolute w-full h-full pointer-events-none'>
        <div className="stars-container">
          {stars.map((star) => (
            <div key={star.id} className="star" style={{ left: star.left, top: star.top, animationDelay: star.delay, width: star.size, height: star.size }}></div>
          ))}
        </div>
      </div>

      <div className="w-screen overflow-hidden relative z-10">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-4xl sm:text-3xl text-[#ffcc75] font-extrabold mb-2">🎭 Performance Rating</h1>
          <p className="text-blue-200 text-base sm:text-lg">Score performers based on 5 criteria</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Scoring Criteria Table */}
          <div className="p-4 sm:p-6 rounded-2xl"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-blue-300 mb-4">📋 Scoring Matrix</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead>
                  <tr className="border-b border-blue-300/30">
                    <th className="text-left p-2 sm:p-3 text-blue-200">Criteria</th>
                    <th className="text-left p-2 sm:p-3 text-blue-200">Description</th>
                    <th className="text-right p-2 sm:p-3 text-blue-200">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map((criterion, idx) => (
                    <tr key={idx} className="border-b border-blue-300/20 hover:bg-blue-500/10">
                      <td className="p-2 sm:p-3 text-white font-semibold">{criterion.name}</td>
                      <td className="p-2 sm:p-3 text-gray-300 text-xs sm:text-sm">{criterion.description}</td>
                      <td className="text-right p-2 sm:p-3 text-yellow-300 font-bold">{criterion.points}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-500/10">
                    <td colSpan={2} className="p-2 sm:p-3 text-white font-bold">Total</td>
                    <td className="text-right p-2 sm:p-3 text-yellow-300 font-bold text-lg">100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Rating Form */}
          <div className="p-4 sm:p-6 rounded-2xl"
            style={{
              background: 'rgba(147, 51, 234, 0.1)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              {editingRatingId ? 'Edit Rating' : 'Submit Rating'}
            </h2>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              {/* Performer Selection */}
              <div>
                <label className="block text-sm font-semibold text-purple-200 mb-2">Select Performer *</label>
                <select
                  value={selectedPerformer?.id || ''}
                  onChange={(e) => {
                    const performer = performers.find(p => p.id === parseInt(e.target.value));
                    setSelectedPerformer(performer || null);
                  }}
                  required
                  className="w-full px-4 py-2 bg-black/30 border border-purple-300/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Choose a performer...</option>
                  {performers.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Ratings */}
              <div className="space-y-3 mt-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">Rating Scores</h3>
                {CRITERIA.map((criterion, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-black/20 border border-purple-300/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold text-white">{criterion.name}</p>
                        <p className="text-xs sm:text-sm text-gray-400">{criterion.description}</p>
                      </div>
                      <p className="text-sm text-purple-300 font-semibold">Max: {criterion.points}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min="0"
                        max={criterion.points}
                        value={ratings[idx]}
                        onChange={(e) => handleRatingChange(idx, parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-black/30 border border-purple-300/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      />
                      <div className="flex-1 h-2 bg-purple-300/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                          style={{ width: `${(ratings[idx] / criterion.points) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-purple-300 font-semibold">{ratings[idx]}/{criterion.points}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Score */}
              <div className="p-4 rounded-lg bg-purple-500/20 border border-purple-300/30">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-purple-300">Total Score</span>
                  <span className="text-3xl font-bold text-yellow-300">{totalPoints}/100</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : editingRatingId ? 'Update Rating' : 'Submit Rating'}
                </button>
                {editingRatingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setRatings([0, 0, 0, 0, 0]);
                      setSelectedPerformer(null);
                      setEditingRatingId(null);
                    }}
                    className="flex-1 px-6 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Performer Scores */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#ffcc75]">📊 Performance Scores</h2>
            
            {performers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No performers yet</div>
            ) : (
              performers.map((performer) => {
                const scores = performerScores.get(performer.id);
                
                return (
                  <div
                    key={performer.id}
                    className="p-4 rounded-2xl"
                    style={{
                      background: 'rgba(100, 150, 255, 0.1)',
                      border: '1px solid rgba(100, 200, 255, 0.3)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <button
                      onClick={() => setExpandedPerformer(expandedPerformer === performer.id ? null : performer.id)}
                      className="w-full flex items-center justify-between text-lg font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://zipfile.pythonanywhere.com${performer.photo}`}
                          alt={performer.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span>{performer.name}</span>
                      </div>
                      {expandedPerformer === performer.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>

                    {expandedPerformer === performer.id && scores && (
                      <div className="mt-4 space-y-4">
                        {/* Average Scores */}
                        <div className="p-3 rounded-lg bg-black/20">
                          <h4 className="text-cyan-300 font-semibold mb-3">Average Scores</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {CRITERIA.map((criterion, idx) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span className="text-gray-300">{criterion.name}</span>
                                <span className="text-cyan-300 font-semibold">{(scores.average_scores as any)[criterion.name]}</span>
                              </div>
                            ))}
                            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-cyan-300/20 flex justify-between font-bold">
                              <span className="text-cyan-300">Average Total</span>
                              <span className="text-yellow-300 text-lg">{scores.average_scores.average_total.toFixed(1)}/100</span>
                            </div>
                          </div>
                        </div>

                        {/* Ratings List */}
                        {scores.ratings.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-cyan-300 font-semibold">Judge Ratings ({scores.ratings.length})</h4>
                            {scores.ratings.map((rating) => (
                              <div key={rating.id} className="p-3 rounded-lg bg-black/30 border border-cyan-300/20">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <div>
                                    <p className="font-semibold text-white">{rating.rater}</p>
                                    <p className="text-sm text-gray-400">Score: {rating.total_score}/100</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditRating(rating)}
                                      className="p-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg transition-colors"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-4 h-4 text-blue-300" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRating(rating.id)}
                                      className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-300" />
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-1 text-xs">
                                  {CRITERIA.map((criterion, idx) => (
                                    <div key={idx} className="text-gray-400">
                                      {criterion.name}: <span className="text-cyan-300">{rating.ratings[idx]}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}
