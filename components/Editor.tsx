import React, { useState } from 'react';
import { ResumeData, ExperienceItem, EducationItem, SkillItem, LanguageItem, AIOperationType } from '../types';
import { enhanceText } from '../services/geminiService';
import { Plus, Trash2, Wand2, ChevronDown, ChevronUp, Languages, AlertCircle } from 'lucide-react';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const AIButton: React.FC<{
  onClick: () => void;
  isLoading: boolean;
  label: string;
  icon?: React.ReactNode;
}> = ({ onClick, isLoading, label, icon }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded transition-colors disabled:opacity-50"
  >
    {isLoading ? (
      <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      icon || <Wand2 size={12} />
    )}
    {label}
  </button>
);

export const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [loadingField, setLoadingField] = useState<string | null>(null);

  const updatePersonal = (field: keyof typeof data.personalInfo, value: any) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonal('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhanceText = async (
    text: string, 
    path: string, 
    operation: AIOperationType, 
    callback: (val: string) => void,
    context?: string
  ) => {
    if (!text) return;
    setLoadingField(path);
    try {
      const result = await enhanceText(text, operation, context);
      callback(result);
    } finally {
      setLoadingField(null);
    }
  };

  // --- Experience Helpers ---
  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        {
          id: Date.now().toString(),
          position: '',
          company: '',
          city: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        },
        ...data.experience
      ]
    });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(item => item.id !== id)
    });
  };

  // --- Education Helpers ---
  const addEducation = () => {
    onChange({
      ...data,
      education: [
        {
          id: Date.now().toString(),
          school: '',
          degree: '',
          city: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        },
        ...data.education
      ]
    });
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: any) => {
    onChange({
      ...data,
      education: data.education.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(item => item.id !== id)
    });
  };

  // --- Skills Helpers ---
  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, { id: Date.now().toString(), name: '', level: 3 }]
    });
  };

  const updateSkill = (id: string, field: keyof SkillItem, value: any) => {
    onChange({
      ...data,
      skills: data.skills.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter(item => item.id !== id)
    });
  };

   // --- Language Helpers ---
   const addLanguage = () => {
    onChange({
      ...data,
      languages: [...data.languages, { id: Date.now().toString(), language: '', proficiency: 'Fließend' }]
    });
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, value: any) => {
    onChange({
      ...data,
      languages: data.languages.map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeLanguage = (id: string) => {
    onChange({
      ...data,
      languages: data.languages.filter(item => item.id !== id)
    });
  };

  const SectionHeader = ({ title, id, icon }: { title: string, id: string, icon?: React.ReactNode }) => (
    <button
      onClick={() => setActiveSection(activeSection === id ? '' : id)}
      className={`w-full flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors ${activeSection === id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </div>
      {activeSection === id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200 overflow-y-auto w-full">
      <div className="p-6 bg-white border-b border-gray-200">
        <h2 className="text-xl font-bold text-slate-800">Editor</h2>
        <p className="text-sm text-slate-500 mt-1">Fill in your details. Use the AI buttons to improve or translate your text.</p>
        {!process.env.API_KEY && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <p>Gemini API key not detected. AI features will be disabled.</p>
            </div>
        )}
      </div>

      {/* Personal Info */}
      <SectionHeader title="Persönliche Daten" id="personal" />
      {activeSection === 'personal' && (
        <div className="p-6 space-y-4 bg-white animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Vorname</label>
              <input 
                type="text" 
                value={data.personalInfo.firstName}
                onChange={(e) => updatePersonal('firstName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nachname</label>
              <input 
                type="text" 
                value={data.personalInfo.lastName}
                onChange={(e) => updatePersonal('lastName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Aktueller Jobtitel</label>
            <input 
              type="text" 
              value={data.personalInfo.jobTitle}
              onChange={(e) => updatePersonal('jobTitle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              placeholder="z.B. Senior Software Engineer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">E-Mail</label>
                <input 
                  type="email" 
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Telefon</label>
                <input 
                  type="text" 
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
             </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Adresse</label>
            <input 
              type="text" 
              value={data.personalInfo.address}
              onChange={(e) => updatePersonal('address', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">PLZ</label>
                <input 
                  type="text" 
                  value={data.personalInfo.zip}
                  onChange={(e) => updatePersonal('zip', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Stadt</label>
                <input 
                  type="text" 
                  value={data.personalInfo.city}
                  onChange={(e) => updatePersonal('city', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">Geburtsdatum</label>
               <input 
                 type="date" 
                 value={data.personalInfo.birthDate}
                 onChange={(e) => updatePersonal('birthDate', e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
               />
            </div>
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1">Geburtsort</label>
               <input 
                 type="text" 
                 value={data.personalInfo.birthPlace}
                 onChange={(e) => updatePersonal('birthPlace', e.target.value)}
                 className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
               />
            </div>
          </div>
          
           <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Foto Upload</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          <div className="pt-2 border-t border-gray-100">
             <label className="block text-xs font-medium text-gray-700 mb-1">Links</label>
             <input 
               type="text" 
               placeholder="LinkedIn URL"
               value={data.personalInfo.linkedin}
               onChange={(e) => updatePersonal('linkedin', e.target.value)}
               className="w-full p-2 mb-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
             />
             <input 
               type="text" 
               placeholder="Portfolio / Webseite"
               value={data.personalInfo.website}
               onChange={(e) => updatePersonal('website', e.target.value)}
               className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
             />
          </div>
        </div>
      )}

      {/* Experience */}
      <SectionHeader title="Berufserfahrung" id="experience" />
      {activeSection === 'experience' && (
        <div className="p-6 bg-white animate-in slide-in-from-top-2">
           <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                   <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Position</label>
                    <input 
                      type="text" 
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Firma</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stadt</label>
                    <input 
                      type="text" 
                      value={exp.city}
                      onChange={(e) => updateExperience(exp.id, 'city', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Von</label>
                    <input 
                      type="date" 
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bis</label>
                     <div className="flex gap-2 items-center">
                        <input 
                          type="date" 
                          disabled={exp.current}
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm disabled:opacity-50"
                        />
                        <div className="flex items-center gap-1">
                          <input 
                            type="checkbox" 
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          />
                          <span className="text-xs">Aktuell</span>
                        </div>
                     </div>
                   </div>
                </div>
                
                <div className="mt-3">
                   <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-medium text-gray-700">Beschreibung</label>
                    <div className="flex gap-1">
                      <AIButton 
                         label="Polish (DE)"
                         isLoading={loadingField === `exp_${exp.id}_desc`}
                         onClick={() => handleEnhanceText(
                           exp.description, 
                           `exp_${exp.id}_desc`, 
                           'polish', 
                           (val) => updateExperience(exp.id, 'description', val),
                           'job description'
                         )}
                      />
                       <AIButton 
                         label="EN → DE"
                         icon={<Languages size={12}/>}
                         isLoading={loadingField === `exp_${exp.id}_trans`}
                         onClick={() => handleEnhanceText(
                           exp.description, 
                           `exp_${exp.id}_trans`, 
                           'translate_to_german', 
                           (val) => updateExperience(exp.id, 'description', val),
                           'job description'
                         )}
                      />
                    </div>
                   </div>
                   <textarea 
                     rows={4}
                     value={exp.description}
                     onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded text-sm"
                     placeholder="Hauptaufgaben und Erfolge..."
                   />
                </div>
              </div>
            ))}
            
            <button onClick={addExperience} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2 text-sm font-medium">
               <Plus size={16} /> Stelle hinzufügen
            </button>
           </div>
        </div>
      )}

      {/* Education */}
      <SectionHeader title="Ausbildung" id="education" />
      {activeSection === 'education' && (
        <div className="p-6 bg-white animate-in slide-in-from-top-2">
          <div className="space-y-6">
            {data.education.map((edu) => (
              <div key={edu.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                <button 
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid grid-cols-2 gap-3 mb-3">
                   <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Abschluss / Titel</label>
                    <input 
                      type="text" 
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bildungseinrichtung</label>
                    <input 
                      type="text" 
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stadt</label>
                    <input 
                      type="text" 
                      value={edu.city}
                      onChange={(e) => updateEducation(edu.id, 'city', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start</label>
                    <input 
                      type="date" 
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm"
                    />
                   </div>
                   <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ende</label>
                    <input 
                      type="date" 
                      value={edu.endDate}
                      disabled={edu.current}
                      onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm disabled:opacity-50"
                    />
                   </div>
                   <div className="flex items-center pt-6">
                      <input 
                            type="checkbox" 
                            checked={edu.current}
                            onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                            className="mr-2"
                          />
                      <label className="text-xs">Aktuell</label>
                   </div>
                </div>

                 <div className="mt-3">
                   <div className="flex justify-between items-end mb-1">
                    <label className="block text-xs font-medium text-gray-700">Beschreibung / Schwerpunkt</label>
                    <AIButton 
                         label="Polish"
                         isLoading={loadingField === `edu_${edu.id}_desc`}
                         onClick={() => handleEnhanceText(
                           edu.description, 
                           `edu_${edu.id}_desc`, 
                           'polish', 
                           (val) => updateEducation(edu.id, 'description', val),
                           'education description'
                         )}
                      />
                   </div>
                   <textarea 
                     rows={3}
                     value={edu.description}
                     onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                     className="w-full p-2 border border-gray-300 rounded text-sm"
                   />
                </div>
              </div>
            ))}
             <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2 text-sm font-medium">
               <Plus size={16} /> Ausbildung hinzufügen
            </button>
          </div>
        </div>
      )}

      {/* Skills */}
      <SectionHeader title="Kenntnisse" id="skills" />
      {activeSection === 'skills' && (
         <div className="p-6 bg-white animate-in slide-in-from-top-2">
            <div className="space-y-3">
               {data.skills.map(skill => (
                 <div key={skill.id} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={skill.name}
                      placeholder="Skill (z.B. React)"
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    />
                    <select 
                      value={skill.level}
                      onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="1">Basis</option>
                      <option value="2">Gut</option>
                      <option value="3">Sehr gut</option>
                      <option value="4">Profi</option>
                      <option value="5">Expert</option>
                    </select>
                    <button onClick={() => removeSkill(skill.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))}
               <button onClick={addSkill} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2 text-sm font-medium mt-2">
                 <Plus size={16} /> Skill hinzufügen
               </button>
            </div>
         </div>
      )}

      {/* Languages */}
      <SectionHeader title="Sprachen" id="languages" />
      {activeSection === 'languages' && (
         <div className="p-6 bg-white animate-in slide-in-from-top-2 mb-10">
            <div className="space-y-3">
               {data.languages.map(lang => (
                 <div key={lang.id} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={lang.language}
                      placeholder="Sprache (z.B. Englisch)"
                      onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded text-sm"
                    />
                    <select 
                      value={lang.proficiency}
                      onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                      className="w-40 p-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="Grundkenntnisse">Grundkenntnisse</option>
                      <option value="Gut">Gut</option>
                      <option value="Fließend">Fließend</option>
                      <option value="Verhandlungssicher">Verhandlungssicher</option>
                      <option value="Muttersprache">Muttersprache</option>
                    </select>
                    <button onClick={() => removeLanguage(lang.id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                 </div>
               ))}
               <button onClick={addLanguage} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex justify-center items-center gap-2 text-sm font-medium mt-2">
                 <Plus size={16} /> Sprache hinzufügen
               </button>
            </div>
         </div>
      )}
    </div>
  );
};