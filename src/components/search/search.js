import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api"; // --Import API URL and options from api.js file--
import "./search.css";

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    borderRadius: '14px',
    padding: '4px 8px',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.06)',
    fontSize: '14px',
    fontFamily: '"Inter", sans-serif',
    cursor: 'text',
    '&:hover': {
      border: '1px solid rgba(255, 255, 255, 0.8)',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#44545d',
    fontWeight: 400,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1a2a3a',
    fontWeight: 500,
  }),
  input: (provided) => ({
    ...provided,
    color: '#1a2a3a',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '14px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? 'rgba(26, 143, 196, 0.1)' : 'transparent',
    color: '#1a2a3a',
    fontSize: '14px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'rgba(26, 143, 196, 0.2)',
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#8aaabb',
    '&:hover': {
      color: '#1a8fc4',
    },
  }),
};

const Search = ({ onSearchChange }) => {

  // --We will use this state to store the search value with initial value null--
  const [search, setSearch] = useState(null)

  const loadOptions = (inputValue) => {
    // --Fetch data from the API--
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then(response => response.json())
      .then(response => {
        if (!response.data) {
          return { options: [] };
        }
        return {
          options: response.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            }
          }),
        };
      })
      .catch(err => console.error(err));
  }



  const handleOnChange = (searchData) => {
    setSearch(searchData);
    onSearchChange(searchData);
  }

  return (
    <div className="search-wrapper">
      <AsyncPaginate
        placeholder="Search for a city..."
        debounceTimeout={800}
        value={search}
        onChange={handleOnChange}
        loadOptions={loadOptions}
        styles={customStyles}
      />
    </div>
  )
}

export default Search;
