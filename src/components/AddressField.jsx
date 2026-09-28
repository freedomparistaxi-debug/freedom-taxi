import React, { useEffect, useId, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { searchAddresses } from '../data/addresses';

/**
 * Champ d'adresse avec propositions.
 *
 * Le client peut toujours taper une adresse libre : les propositions sont
 * une aide à la saisie, jamais une obligation. Une liste de suggestions
 * native (`datalist`) est utilisée en complément du rendu visuel, pour que
 * le système d'autocomplétion du navigateur reste disponible sur mobile.
 */
export const AddressField = ({
  id,
  name,
  label,
  placeholder,
  value,
  error,
  onChange,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    setSuggestions(searchAddresses(value));
    setActiveIndex(-1);
  }, [value]);

  // Referme la liste si le client clique ailleurs sur la page.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchstart', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchstart', onClickOutside);
    };
  }, [isOpen]);

  const select = (suggestion) => {
    onChange({ target: { name, value: suggestion.label } });
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const onKeyDown = (event) => {
    if (!isOpen || suggestions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      // On empêche la soumission du formulaire quand une proposition est active.
      event.preventDefault();
      select(suggestions[activeIndex]);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef}>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          autoComplete="street-address"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onChange(event);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          className={`w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm text-navy-900 bg-surface-light focus:bg-white focus:outline-none focus:ring-2 ${
            error ? 'border-rose-400' : 'border-slate-200 focus:ring-brandBlue-500/40'
          }`}
        />
        {/* Autocomplétion native du navigateur, en complément de la liste. */}
        <datalist id={`${id}-datalist`}>
          {suggestions.map((suggestion) => (
            <option key={suggestion.label} value={suggestion.label} />
          ))}
        </datalist>

        {isOpen && suggestions.length > 0 && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg py-1"
          >
            {suggestions.map((suggestion, index) => (
              <li key={suggestion.label} role="none">
                <button
                  type="button"
                  role="option"
                  id={`${listId}-${index}`}
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => select(suggestion)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm flex items-start gap-2 transition-colors ${
                    index === activeIndex ? 'bg-brand-50 text-navy-900' : 'text-slate-700 hover:bg-surface-light'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium">{suggestion.street}</span>
                    <span className="block text-xs text-slate-500">
                      {suggestion.postcode} {suggestion.city}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
};
