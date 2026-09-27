import React from 'react';
import { User, Phone, Mail, AlertCircle } from 'lucide-react';

export const FormContactFields = ({ formData, errors, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">Nom & Prénom *</label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="M. Dupont"
            value={formData.name}
            onChange={onChange}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
              errors.name ? 'border-rose-400 focus:ring-rose-400/40' : 'border-slate-200 focus:ring-brandBlue-500/40'
            }`}
          />
        </div>
        {errors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">Téléphone *</label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="06 12 34 56 78"
            value={formData.phone}
            onChange={onChange}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
              errors.phone ? 'border-rose-400 focus:ring-rose-400/40' : 'border-slate-200 focus:ring-brandBlue-500/40'
            }`}
          />
        </div>
        {errors.phone && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">Email <span className="text-slate-400 font-normal">(facultatif)</span></label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nom@exemple.com"
            value={formData.email}
            onChange={onChange}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
              errors.email ? 'border-rose-400 focus:ring-rose-400/40' : 'border-slate-200 focus:ring-brandBlue-500/40'
            }`}
          />
        </div>
        {errors.email && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
      </div>
    </div>
  );
};
