import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import axios from './../plugin/axios'

interface Candidate {
  id?: number;
  title: string;
  location: string;
  age: number;
  image: string;
  date: string;
  gender: 'M' | 'F';
}

interface Performer {
  id?: number;
  name: string;
  photo: string;
  created_at?: string;
  updated_at?: string;
}

const LOCATIONS = [
  'Regional Office',
  'Bukidnon Provincial Office',
  'Camiguin Provincial Office',
  'Misamis Oriental Provincial Office',
  'Misamis Occidental Provincial Office',
  'Lanao del Norte Provincial Office',
  'Iligan City Office'
];

export default function Admin() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPerformerId, setEditingPerformerId] = useState<number | null>(null);
  const [expandedGender, setExpandedGender] = useState<'M' | 'F' | null>('M');
  const [isCustomName, setIsCustomName] = useState(false);
  const [selectedName, setSelectedName] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'candidates' | 'performers'>('candidates');

  const NAMES = [
    'Gualdaquever, Kinnara D.',
'Cabañero, Neil Benedict A.',
'Buot, Michael Andrew E',
'Macagaan, Alyssa Marie R.',
'NADALA, MA. THERESA ROCHELLE D.',
'NORHAIFAH AMORAN',
'Alva, Maria Cecilia, Tomaclas',
'WABE, JENIEL C.', 
'Garde, Tricia R.',
'Bandiala, Angel Rose J.',
'Cabañero, Junard B.',
'Vistal, Allan A.',
'BALANGUE, ASHLIA S.',
'Indad, Marwa B.', 
'Galua, Fe Marie Burlat',
'Nacilla, Nideliza Fe, Oyao',
'Genon, Danilo Pabonita',
'JACALAN, DANICA V.',
'BASADRE, REY VICENTE  S.',
'Cuerquis, Alaiza Mae A.',
'ASUNCION, KENNETH T.',
'Mahawan, Ma. Julisa Antonette P.',
'Palacios, Reyson Benedicto',
'Talandron, Peter Jerome, A.',
'Vicerra, Jules Des\'ree M.',
'Estillore Eusebio Yana',
'Bregoños Zenita Lopez',
'Smith, Owieda B.',
'Llanes, Jason S.',
'Caulin, Ian Nico M.',
'Reyes, Ryan Jay T.',
'Amores, Almarie C.',
'Daroy, Jimyco B.',
'Abbas, Jawad, R.',
'Macarimbang Albanie Alapa',
'Arrozado David Berones',
'Dael, Angelica Rose R.',
'Jomaya, Luther John J.',
'Castil, Judy Ann, S.',
'Vallespin, Mariel Faith D.',
'CADIZ, KRYZLL MAE L.',
'Marciano J. Ramayla Jr.',
'Cabactulan, Mark Clied, G.',
'Guzman,Rolando T.',
'Lacadin, Keren Happuch A.', 
'Nova Jane N. Salvaña',
'SUMIMBA,CIRILO A.',
'Jabiniao, Rezllhe F.',
'Mendrez, Mark Ian M.',
'Nagamora, Jamalicah A.',
'Omar, Mohammad Shawiy Amanoddin',
'Dumio, Jaymark, D',
'Lumogdang, Christell Faith D.',
'Sagocsoc, James Kevin, M',
'Asum, Aaliyah P.',
'Turrobia, Jelin A.',
'Carangan, Ella Grace S.',
'Macabuat, Acmilah M',
'Cabahit, Elezah May S.',
'Garde, Tricia, R.',
'SABLAS, BRYAN JOHN M.',
'Duhaylungsod  Glenn C.',
'Raposala, Eugene III C.',
'Ladra,Cristeve S.',
'Nadala. Ma. Theresa Rochelle D.',
'Datoy, Eric P.',
'MANATAD, REYNALDO, ARCILLAS',
'Rivera, Anthony Ludovico C.',
'Abao Edison Dulhao',
'Morden Jefrey',
'MAGHACOT, JANE T.',
'Pios, Karl Jasson B.',
'MIER RICHARD CAGALITAN',
'Pasandalan, Alnorodden B.',
'Pangarungan, Ayman S.',
'Mercado, Ernest Justin M.',
'AZIS, SALWAH, D.', 
'Vicerra, Philip.V',
'Bandiala, Angel Rose J.',
'Bondal, Lois Francis Banghal',
'Macabuat, Acmilah M',
'NADALA, MA. THERESA ROCHELLE D.',
'Cabillo, Johanna Zola A.',
'Azis,Salwah D.',
'Ditucalan Aminoden M',
'Estillore, Eusebio Y.',
'Pakino, Jerile, R',
'Cotamora Mario C.',
'MARIO S. MALINIS',
'Lariosa,Dante Daapong',
'Alva, Maria Cecilia T.',
'Labadan, Jaide B.',
'Comadug, Farhana Domadalug',
'ACTUB, EMELINE H.',
'Nuska, Alvin V.',
'Duhaylungsod Glenn C',
'Alva, Maria Cecilia T.',
'Labadan, Hope Shalom E.',
'Mulay, Jeamaluding A.',
'Morden Jefrey',
'Nacilla, Nideliza Fe, O',
'Raniai 1, Juwairiyah Rauffa A.',
'Ligan, Elbert Laurence, L.',
'Mangadang, Dibangkitun L.',
'ZAMORA, JUNIEJO O.',
'Genon, Danilo Pabonita',
'DANILO P. GENON',
'Lungay, Anthony, S.',
'Maruhom, Jehan A',
'Dipatuan, Noroden, M.',
'ABUBACAR JAWWAD RAOF B.', 
'Marohombsar, ANNA FARINA M.',
'Raniai, Junainah Azima II A.',
'Domiangca, Norhata D.',
'Aliasgar, Najidah E.',
'Mulay, Jeamaluding A.',
'Luchana, Ramon Erlo, D.',
'BACARAT, MANGONTAWAR O.',
'BACARAT, SANDIGAN O.',
'Engr. Jeoffrey F. Albay',
'Khiro Climense Pudadera',
'Dave Christian V. Rivera',
'Munich Cove Tangapa',
'Marifel Grace T. Caga',
'Camille S. Decinilla',
'Homyl P. Espinosa',
'Trisha Mae M. Gonzales',
'Ruthcel N. Molijon',
'Ira Mae S. Nacalaban',
'Jhonel M. Quilab',
'Vanessa Pearl B. Veloz',
'Riecagen P. Calamba',
'Desirie O. Escalante',
'Humphrey E. Manuel',
'Alliana Marie M. Oñate',
'Angelyn E. Petallo',
'Alvin M. Poro Jr.',
'Kenneth Jay G. Sabuero',
'William E. Santillan Jr.',
'Ryan G. Sarip',
'Moammar A. Usman',
'Sohaib M. Amerol',
'Amalhaya Hadji Asis',
'Bairona Pangaga',
'Jherlen D. Alingal',
'Julie Anne Amor',
'VERLIE FEA GRACE P. CELLAN',
'Sarah U. Palma',
'Dessa Mae T. Manlangit',
'SITTIE RAHMA V. ALAWI'
  ];

  const nameOptions = [
    ...NAMES.map(name => ({ value: name, label: name })),
    { value: 'others', label: '+ Others (Specify)', isSpecial: true }
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Candidate>({
    title: '',
    location: '',
    age: 0,
    image: '',
    date: new Date().toISOString().split('T')[0],
    gender: 'M',
  });

  // Performer form state
  const [performerPhotoFile, setPerformerPhotoFile] = useState<File | null>(null);
  const [performerFormData, setPerformerFormData] = useState<Performer>({
    name: '',
    photo: '',
  });

  // Fetch all candidates
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/vote/candidates/');
      
      // Handle different response formats
      let candidatesData: Candidate[] = [];
      
      if (response.data.mr || response.data.ms) {
        // New format with "mr" and "ms" properties
        candidatesData = [
          ...(response.data.mr || []),
          ...(response.data.ms || [])
        ];
      } else if (response.data.results) {
        // Results format
        candidatesData = response.data.results;
      } else if (Array.isArray(response.data)) {
        // Direct array format
        candidatesData = response.data;
      }
      
      setCandidates(candidatesData);
      setError('');
    } catch (err) {
      setError('Failed to fetch candidates');
      setCandidates([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchPerformers();
  }, []);

  // Fetch all performers
  const fetchPerformers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/rate/performers/');
      setPerformers(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (err) {
      setError('Failed to fetch performers');
      setPerformers([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseFloat(value) : value,
    });
  };

  const handleNameChange = (option: any) => {
    if (option?.value === 'others') {
      setIsCustomName(true);
      setSelectedName(null);
      setFormData({
        ...formData,
        title: '',
      });
    } else {
      setIsCustomName(false);
      setSelectedName(option);
      setFormData({
        ...formData,
        title: option?.value || '',
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file object for submission
      setImageFile(file);
      
      // Store base64 for preview only
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create FormData for multipart/form-data submission (required for images)
      const formDataMultipart = new FormData();
      formDataMultipart.append('title', formData.title);
      formDataMultipart.append('location', formData.location);
      formDataMultipart.append('age', formData.age.toString());
      formDataMultipart.append('date', formData.date);
      formDataMultipart.append('gender', formData.gender);
      
      // Append actual File object, not base64 string
      if (imageFile) {
        formDataMultipart.append('image', imageFile);
      }

      if (editingId) {
        // Update
        const response = await axios.put(`/api/v1/vote/update/${editingId}/`, formDataMultipart);
        setCandidates(candidates.map(c => c.id === editingId ? { ...response.data, gender: formData.gender } : c));
        setEditingId(null);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Candidate updated successfully!',
          confirmButtonColor: '#040b35',
          background: '#0a1535',
          color: '#ffffff'
        });
      } else {
        // Create
        const response = await axios.post('/api/v1/vote/candidates/', formDataMultipart);
        setCandidates([...candidates, { ...response.data, gender: formData.gender }]);
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Candidate created successfully!',
          confirmButtonColor: '#040b35',
          background: '#0a1535',
          color: '#ffffff'
        });
      }

    //   // Reset form data
    //   setImageFile(null);
    //   setFormData({
    //     title: '',
    //     location: '',
    //     age: 0,
    //     image: '',
    //     date: new Date().toISOString().split('T')[0],
    //     gender: 'M',
    //   });
    //   setIsCustomName(false);
    //   setSelectedName(null);

      // Clear messages after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save candidate';
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

  const handleEdit = (candidate: Candidate) => {
    setFormData(candidate);
    setEditingId(candidate.id || null);
    setExpandedGender(candidate.gender);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this candidate!',
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
    setError('');
    setSuccess('');

    try {
      await axios.delete(`/api/v1/vote/candidates/${id}/`);
      setCandidates(candidates.filter(c => c.id !== id));
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Candidate deleted successfully!',
        confirmButtonColor: '#040b35',
        background: '#0a1535',
        color: '#ffffff'
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete candidate';
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

  const handleCancel = () => {
    setEditingId(null);
    setIsCustomName(false);
    setSelectedName(null);
    setImageFile(null);
    setFormData({
      title: '',
      location: '',
      age: 0,
      image: '',
      date: new Date().toISOString().split('T')[0],
      gender: 'M',
    });
  };

  // Performer handlers
  const handlePerformerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerformerFormData({
      ...performerFormData,
      [name]: value,
    });
  };

  const handlePerformerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPerformerPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerformerFormData({
          ...performerFormData,
          photo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePerformerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataMultipart = new FormData();
      formDataMultipart.append('name', performerFormData.name);
      if (performerPhotoFile) {
        formDataMultipart.append('photo', performerPhotoFile);
      }

      if (editingPerformerId) {
        await axios.put(`/api/v1/rate/performers/${editingPerformerId}/`, formDataMultipart);
        await fetchPerformers();
        setEditingPerformerId(null);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Performer updated successfully!',
          confirmButtonColor: '#040b35',
          background: '#0a1535',
          color: '#ffffff'
        });
      } else {
        await axios.post('/api/v1/rate/performers/', formDataMultipart);
        await fetchPerformers();
        Swal.fire({
          icon: 'success',
          title: 'Created!',
          text: 'Performer created successfully!',
          confirmButtonColor: '#040b35',
          background: '#0a1535',
          color: '#ffffff'
        });
      }

      setPerformerPhotoFile(null);
      setPerformerFormData({ name: '', photo: '' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save performer';
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

  const handlePerformerEdit = (performer: Performer) => {
    setPerformerFormData(performer);
    setEditingPerformerId(performer.id || null);
  };

  const handlePerformerDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this performer!',
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
      await axios.delete(`/api/v1/rate/performers/${id}/`);
      await fetchPerformers();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Performer deleted successfully!',
        confirmButtonColor: '#040b35',
        background: '#0a1535',
        color: '#ffffff'
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete performer';
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

  const handlePerformerCancel = () => {
    setEditingPerformerId(null);
    setPerformerPhotoFile(null);
    setPerformerFormData({ name: '', photo: '' });
  };

  const menCandidates = candidates.filter(c => c.gender === 'M');
  const womenCandidates = candidates.filter(c => c.gender === 'F');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#040b35] to-[#1a1a3e] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ffcc75] mb-2">
            Admin Dashboard
          </h1>
          <p className="text-blue-200 text-lg">Manage Mr. and Ms. Best Dressed Candidates</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('candidates')}
            className="px-6 py-2.5 rounded-full font-semibold transition-all"
            style={{
              background: activeTab === 'candidates' 
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(147, 51, 234, 0.6) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'candidates' 
                ? '1px solid rgba(59, 130, 246, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('performers')}
            className="px-6 py-2.5 rounded-full font-semibold transition-all"
            style={{
              background: activeTab === 'performers' 
                ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.6) 0%, rgba(236, 72, 153, 0.6) 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              border: activeTab === 'performers' 
                ? '1px solid rgba(147, 51, 234, 0.8)'
                : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white'
            }}
          >
            Performers
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Candidates Tab */}
          {activeTab === 'candidates' && (
            <>
              {/* Form Section */}
              <div className="lg:col-span-1">
            <div
              className="p-6 rounded-2xl sticky top-8"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {editingId ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Name *
                  </label>
                  {!isCustomName ? (
                    <Select
                      options={nameOptions}
                      value={selectedName}
                      onChange={handleNameChange}
                      placeholder="Search or select a name..."
                      isClearable
                      isSearchable
                      styles={customSelectStyles}
                      required
                    />
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Type name here..."
                        required
                        className="flex-1 px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomName(false);
                          setSelectedName(null);
                          setFormData({ ...formData, title: '' });
                        }}
                        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        Back
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Location *
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select a location</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    step="1"
                    min="0"
                    max="120"
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="M">M (Prince)</option>
                    <option value="F">F (Princess)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-blue-200 mb-2">
                    Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 bg-black/30 border border-blue-300/30 rounded-lg text-white focus:outline-none focus:border-blue-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="mt-3 w-full h-32 object-cover rounded-lg border border-blue-300/30"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Add Candidate'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-6 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Candidates List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Princes Section */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <button
                onClick={() => setExpandedGender(expandedGender === 'M' ? null : 'M')}
                className="w-full flex items-center justify-between text-2xl font-bold text-blue-300 mb-4 hover:text-blue-200 transition-colors"
              >
                <span>👨 Princes ({menCandidates.length})</span>
                {expandedGender === 'M' ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>

              {expandedGender === 'M' && (
                <div className="space-y-4">
                  {menCandidates.length > 0 ? (
                    menCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="p-4 rounded-lg border border-blue-300/30 bg-black/20 hover:bg-black/40 transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={ `https://zipfile.pythonanywhere.com${candidate.image}` || 'https://via.placeholder.com/80?text=No+Image'}
                            alt={candidate.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{candidate.title}</h3>
                            <p className="text-blue-300 text-sm">{candidate.location}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>⭐ {candidate.age}</span>
                              <span>📅 {candidate.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(candidate)}
                              className="p-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5 text-blue-300" />
                            </button>
                            <button
                              onClick={() => candidate.id && handleDelete(candidate.id)}
                              className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No princes yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Princesses Section */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
              }}
            >
              <button
                onClick={() => setExpandedGender(expandedGender === 'F' ? null : 'F')}
                className="w-full flex items-center justify-between text-2xl font-bold text-purple-300 mb-4 hover:text-purple-200 transition-colors"
              >
                <span>👩 Princesses ({womenCandidates.length})</span>
                {expandedGender === 'F' ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>

              {expandedGender === 'F' && (
                <div className="space-y-4">
                  {womenCandidates.length > 0 ? (
                    womenCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="p-4 rounded-lg border border-purple-300/30 bg-black/20 hover:bg-black/40 transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={`https://zipfile.pythonanywhere.com${candidate.image}` || 'https://via.placeholder.com/80?text=No+Image'}
                            alt={candidate.title}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{candidate.title}</h3>
                            <p className="text-purple-300 text-sm">{candidate.location}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>⭐ {candidate.age}</span>
                              <span>📅 {candidate.date}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(candidate)}
                              className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-5 h-5 text-purple-300" />
                            </button>
                            <button
                              onClick={() => candidate.id && handleDelete(candidate.id)}
                              className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-red-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No princesses yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
            </>
          )}

          {/* Performers Tab */}
          {activeTab === 'performers' && (
            <>
              {/* Performer Form Section */}
              <div className="lg:col-span-1">
            <div
              className="p-6 rounded-2xl sticky top-8"
              style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
              }}
            >
              <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                {editingPerformerId ? 'Edit Performer' : 'Add New Performer'}
              </h2>

              <form onSubmit={handlePerformerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={performerFormData.name}
                    onChange={handlePerformerInputChange}
                    placeholder="Enter performer name..."
                    required
                    className="w-full px-4 py-2 bg-black/30 border border-purple-300/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-purple-200 mb-2">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePerformerPhotoUpload}
                    className="w-full px-4 py-2 bg-black/30 border border-purple-300/30 rounded-lg text-white focus:outline-none focus:border-purple-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white file:cursor-pointer"
                  />
                  {performerFormData.photo && (
                    <img
                      src={performerFormData.photo}
                      alt="Preview"
                      className="mt-3 w-full h-32 object-cover rounded-lg border border-purple-300/30"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingPerformerId ? 'Update' : 'Add Performer'}
                  </button>
                  {editingPerformerId && (
                    <button
                      type="button"
                      onClick={handlePerformerCancel}
                      className="flex-1 px-6 py-2 bg-gray-600 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Performers List */}
          <div className="lg:col-span-2">
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(147, 51, 234, 0.1)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
              }}
            >
              <h2 className="text-2xl font-bold text-purple-300 mb-4">🎭 Performers ({performers.length})</h2>

              <div className="space-y-4">
                {performers.length > 0 ? (
                  performers.map((performer) => (
                    <div
                      key={performer.id}
                      className="p-4 rounded-lg border border-purple-300/30 bg-black/20 hover:bg-black/40 transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={`https://zipfile.pythonanywhere.com${performer.photo}` || 'https://via.placeholder.com/80?text=No+Image'}
                          alt={performer.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-lg">{performer.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>📅 {new Date(performer.created_at || '').toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePerformerEdit(performer)}
                            className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5 text-purple-300" />
                          </button>
                          <button
                            onClick={() => performer.id && handlePerformerDelete(performer.id)}
                            className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5 text-red-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No performers yet</p>
                )}
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
