import React from 'react';
import { Calendar, Clock, Users, AlertCircle, PhoneCall } from 'lucide-react';
import { AddressField } from './AddressField';

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
        <AddressField
          id="pickup"
          name="pickup"
          label="Adresse de départ *"
          placeholder="Commencez à saisir votre adresse"
          value={formData.pickup}
          error={errors.pickup}
          onChange={onChange}
        />

        <AddressField
          id="destination"
          name="destination"
          label="Destination *"
          placeholder="Aéroport, hôpital, gare, adresse..."
          value={formData.destination}
          error={errors.destination}
          onChange={onChange}
        />
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

      <div>
        <label htmlFor="callbackTime" className="block text-xs font-semibold text-slate-700 mb-1">
          À quel moment souhaitez-vous être recontacté(e) ?{' '}
          <span className="text-slate-400 font-normal">(facultatif)</span>
        </label>
        <div className="relative">
          <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            id="callbackTime"
            name="callbackTime"
            type="text"
            placeholder="Matin, après-midi, soirée — ou vos horaires"
            value={formData.callbackTime}
            onChange={onChange}
            className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
              errors.callbackTime ? 'border-rose-400' : 'border-slate-200 focus:ring-brandBlue-500/40'
            }`}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Indiquez le moment qui vous convient le mieux pour que nous vous rappelions.
        </p>
        {errors.callbackTime && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.callbackTime}</p>}
      </div>
    </div>
  );
};
