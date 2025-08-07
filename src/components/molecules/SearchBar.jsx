import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search products...", 
  onSearch, 
  className,
  suggestions = [],
  ...props 
}) => {
const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setShowSuggestions(false);

try {
      const sanitizedQuery = query.trim();
      
      if (!sanitizedQuery) {
        return;
      }
if (onSearch) {
        await onSearch(sanitizedQuery);
      }

} catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

const handleInputChange = (e) => {
    const value = e.target.value;
    
    setQuery(value);
    setShowSuggestions(value.length > 2);
  };

const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    if (onSearch && suggestion) {
      onSearch(suggestion);
    }
  };

  return (
<div className={cn("relative", className)} {...props}>
      <form onSubmit={handleSearch} className="relative" role="search">
        <div className="relative">
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            role="searchbox"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(query.length > 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10"
            maxLength={100}
            autoComplete="off"
            spellCheck="false"
            aria-label="Search products"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Type to search products. Use at least 3 characters for suggestions.
          </div>
          
          {query && !isSearching && (
            <button
              type="button"
onClick={() => {
                setQuery("");
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Clear search"
              title="Clear search"
            >
              <ApperIcon name="X" className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </button>
          )}
          
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" aria-label="Searching" />
            </div>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-large z-50 max-h-60 overflow-y-auto">
          {suggestions.slice(0, 8).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
            >
              <div className="flex items-center space-x-2">
                <ApperIcon name="Search" className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;