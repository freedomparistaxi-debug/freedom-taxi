import React from 'react';
import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

export const FormRideFields = ({ formData, errors, onChange, today }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="date"
              name="date"
              type="date"
              min={today}
              value={formData.date}
              onChange={onChange}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
                errors.date ? 'border-rose-400' : 'border-slate-200 focus:ring-brandBlue-500/40'
              }`}
            />
          </div>
          {errors.date && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.date}</p>}
        </div>

        <div>
          <label htmlFor="time" className="block text-xs font-semibold text-slate-700 mb-1">Heure de prise en charge *</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={onChange}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
                errors.time ? 'border-rose-400' : 'border-slate-200 focus:ring-brandBlue-500/40'
              }`}
            />
          </div>
          {errors.time && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.time}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pickup" className="block text-xs font-semibold text-slate-700 mb-1">Adresse de départ *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="pickup"
              name="pickup"
              type="text"
              placeholder="Adresse de départ"
              value={formData.pickup}
              onChange={onChange}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
                errors.pickup ? 'border-rose-400' : 'border-slate-200 focus:ring-brandBlue-500/40'
              }`}
            />
          </div>
          {errors.pickup && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.pickup}</p>}
        </div>

        <div>
          <label htmlFor="destination" className="block text-xs font-semibold text-slate-700 mb-1">Destination *</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="Aéroport, hôpital, gare, adresse..."
              value={formData.destination}
              onChange={onChange}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
                errors.destination ? 'border-rose-400' : 'border-slate-200 focus:ring-brandBlue-500/40'
              }`}
            />
          </div>
          {errors.destination && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.destination}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="passengers" className="block text-xs font-semibold text-slate-700 mb-1">
          Nombre de passagers
        </label>
        <div className="relative">
          <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="passengers"
            name="passengers"
            type="number"
            min="1"
            max="8"
            inputMode="numeric"
            placeholder="1"
            value={formData.passengers}
            onChange={onChange}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
              errors.passengers ? 'border-rose-400 focus:ring-rose-400/40' : 'border-slate-200 focus:ring-brandBlue-500/40'
            }`}
          />
        </div>
        {errors.passengers && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.passengers}</p>}
      </div>
    </div>
  );
};
