import React from 'react';
import { ResumeData } from '../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, GraduationCap, Briefcase } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const { personalInfo, experience, education, skills, languages } = data;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow-2xl print:shadow-none w-[210mm] min-h-[297mm] mx-auto overflow-hidden text-slate-800 flex print:w-full print:h-full print:absolute print:top-0 print:left-0">
      {/* Left Sidebar */}
      <div className="w-[32%] bg-slate-850 text-white p-6 flex flex-col h-full min-h-[297mm]">
        {/* Photo */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-slate-600 overflow-hidden bg-slate-700 flex items-center justify-center">
            {personalInfo.photoUrl ? (
              <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-slate-400 font-light">
                {personalInfo.firstName[0]}{personalInfo.lastName[0]}
              </span>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-8 space-y-3 text-sm font-light">
          <h3 className="text-lg font-semibold border-b border-slate-600 pb-2 mb-4 uppercase tracking-wider">Kontakt</h3>
          
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-blue-400 shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-blue-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {(personalInfo.address || personalInfo.city) && (
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-blue-400 shrink-0 mt-1" />
              <span>
                {personalInfo.address && <div>{personalInfo.address}</div>}
                {personalInfo.zip} {personalInfo.city}
              </span>
            </div>
          )}

          {personalInfo.birthDate && (
            <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-700">
               <Calendar size={16} className="text-blue-400 shrink-0" />
               <div>
                 <div>{formatDate(personalInfo.birthDate)}</div>
                 {personalInfo.birthPlace && <div className="text-slate-400 text-xs">in {personalInfo.birthPlace}</div>}
               </div>
            </div>
          )}

          {personalInfo.website && (
            <div className="flex items-center gap-3 mt-4">
              <Globe size={16} className="text-blue-400 shrink-0" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">Webseite</a>
            </div>
          )}

          {personalInfo.linkedin && (
             <div className="flex items-center gap-3">
             <Linkedin size={16} className="text-blue-400 shrink-0" />
             <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-300 transition-colors">LinkedIn</a>
           </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold border-b border-slate-600 pb-2 mb-4 uppercase tracking-wider">Kenntnisse</h3>
            <div className="space-y-3 text-sm">
              {skills.map(skill => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-400 h-1.5 rounded-full" 
                      style={{ width: `${(skill.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold border-b border-slate-600 pb-2 mb-4 uppercase tracking-wider">Sprachen</h3>
            <div className="space-y-2 text-sm">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="font-medium">{lang.language}</span>
                  <span className="text-slate-400 text-xs italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 pt-12 relative">
        <header className="mb-10 border-b-2 border-slate-200 pb-6">
          <h1 className="text-4xl font-bold text-slate-800 uppercase tracking-tight mb-2">
            {personalInfo.firstName} <span className="text-blue-600">{personalInfo.lastName}</span>
          </h1>
          <p className="text-xl text-slate-500 font-light tracking-wide">{personalInfo.jobTitle}</p>
        </header>

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <Briefcase size={20} />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">Berufserfahrung</h2>
            </div>
            
            <div className="space-y-6 relative border-l-2 border-slate-100 ml-4 pl-8">
              {experience.map(job => (
                <div key={job.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white"></div>
                  
                  <h3 className="text-lg font-bold text-slate-800">{job.position}</h3>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-semibold text-blue-600">{job.company}, {job.city}</span>
                    <span className="text-slate-500 italic bg-slate-50 px-2 py-0.5 rounded">
                      {formatDate(job.startDate)} – {job.current ? 'Heute' : formatDate(job.endDate)}
                    </span>
                  </div>
                  {job.description && (
                     <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                      {job.description}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                <GraduationCap size={20} />
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-800">Ausbildung</h2>
            </div>
            
            <div className="space-y-6 relative border-l-2 border-slate-100 ml-4 pl-8">
              {education.map(edu => (
                <div key={edu.id} className="relative">
                  <div className="absolute -left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white"></div>
                  
                  <h3 className="text-lg font-bold text-slate-800">{edu.degree}</h3>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-semibold text-blue-600">{edu.school}, {edu.city}</span>
                    <span className="text-slate-500 italic bg-slate-50 px-2 py-0.5 rounded">
                      {formatDate(edu.startDate)} – {edu.current ? 'Heute' : formatDate(edu.endDate)}
                    </span>
                  </div>
                   {edu.description && (
                     <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line text-justify">
                      {edu.description}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Signature Placeholder */}
        <div className="mt-16 pt-8">
           <div className="flex flex-col gap-4 text-slate-500 text-sm">
             <div className="flex justify-between items-end">
               <div>
                 <p>{personalInfo.city || 'Ort'}, {new Date().toLocaleDateString('de-DE')}</p>
                 <div className="w-48 h-0.5 bg-slate-300 mt-8 mb-2"></div>
                 <p className="text-xs uppercase tracking-wide opacity-60">Unterschrift</p>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};