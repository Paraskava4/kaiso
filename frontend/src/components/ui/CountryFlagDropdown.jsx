"use client";
import React, { useState, useRef, useEffect } from "react";
import { countries } from "../../data/countries";
import Icons from "./Icons";
import Image from 'next/image'

const CountryFlagDropdown = ({ selectedCountry, onCountrySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCountrySelect = (country) => {
    onCountrySelect(country);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div className="country-flag-dropdown" ref={dropdownRef}>
      {/* Dropdown trigger */}
      <div 
        className={`country-flag-trigger ${isOpen ? 'open' : ''}`}
        onClick={handleToggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected country: ${selectedCountry.name}`}
      >
        <Image src={selectedCountry.flag}
          alt={`${selectedCountry.name} flag`}
          className="country-flag-image"
           width={100}
            height={100}
             quality={100}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <Icons 
          type="dropdown" 
          size={16} 
          color="#999999" 
          className={`dropdown-icon ${isOpen ? 'rotated' : ''}`}
        />
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="country-flag-dropdown-menu" role="listbox">
          {/* Countries list */}
          <div className="country-list">
            {countries.map((country) => (
              <div
                key={country.code}
                className={`country-item ${selectedCountry.code === country.code ? 'selected' : ''}`}
                onClick={() => handleCountrySelect(country)}
                role="option"
                aria-selected={selectedCountry.code === country.code}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCountrySelect(country);
                  }
                }}
              >
                <Image src={country.flag}
                  alt={`${country.name} flag`}
                  className="country-item-flag"
                  width={100}
                  height={100}
                  quality={100}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="country-item-name">{country.name}</span>
                <span className="country-item-code">{country.phoneCode}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryFlagDropdown;
