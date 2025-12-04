import React, { useState } from 'react';
import { ResumeData } from './types';
import { ResumePreview } from './components/ResumePreview';
import { Editor } from './components/Editor';
import { Printer, Download, Sparkles } from 'lucide-react';

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    firstName: 'Max',
    lastName: 'Mustermann',
    jobTitle: 'Softwareentwickler',
    email: 'max.mustermann@example.com',
    phone: '+49 123 456789',
    address: 'Musterstraße 1',
    city: 'Berlin',
    zip: '10115',
    birthDate: '1990-05-15',
    birthPlace: 'Hamburg',
    photoUrl: null,
    website: '',
    linkedin: ''
  },
  experience: [
    {
      id: '1',
      position: 'Senior Frontend Developer',
      company: 'Tech Solutions GmbH',
      city: 'Berlin',
      startDate: '2021-01-01',
      endDate: '',
      current: true,
      description: 'Leitung des Frontend-Teams für die Neuentwicklung der E-Commerce-Plattform. Implementierung von CI/CD Pipelines und Micro-Frontend Architektur.'
    }
  ],
  education: [
    {
      id: '1',
      school: 'TU Berlin',
      degree: 'Master of Science Informatik',
      city: 'Berlin',
      startDate: '2015-10-01',
      endDate: '2018-09-30',
      current: false,
      description: 'Schwerpunkt: Software Engineering und KI. Masterarbeit über neuronale Netze.'
    }
  ],
  skills: [
    { id: '1', name: 'React / TypeScript', level: 5 },
    { id: '2', name: 'Node.js', level: 4 },
    { id: '3', name: 'Docker', level: 3 },
  ],
  languages: [
    { id: '1', language: 'Deutsch', proficiency: 'Muttersprache' },
    { id: '2', language: 'Englisch', proficiency: 'Verhandlungssicher' }
  ]
};

const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-100">
      {/* Header - Not visible in print */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 print:hidden shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
             <Sparkles size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Lebenslauf Profi</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setIsPreviewMode(!isPreviewMode)}
             className="md:hidden px-4 py-2 text-sm font-medium text-slate-700 bg-gray-100 rounded-lg"
          >
            {isPreviewMode ? 'Editor' : 'Vorschau'}
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Printer size={16} />
            <span className="hidden sm:inline">PDF Exportieren</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Side */}
        <div className={`
          w-full md:w-[450px] lg:w-[500px] h-full overflow-hidden bg-white z-20 transition-transform duration-300 absolute md:relative border-r border-gray-200
          ${isPreviewMode ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
          print:hidden
        `}>
          <Editor data={data} onChange={setData} />
        </div>

        {/* Preview Side */}
        <div className={`
          flex-1 h-full bg-slate-100 overflow-y-auto p-8 flex justify-center
          ${isPreviewMode ? 'absolute inset-0 z-30 bg-slate-100 md:relative' : 'hidden md:flex'}
          print:block print:p-0 print:overflow-visible print:bg-white
        `}>
          <div className="print:w-full">
            <ResumePreview data={data} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;