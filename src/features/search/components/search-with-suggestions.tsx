// ABOUTME: Enhanced search bar with real-time suggestions and autocomplete
// ABOUTME: Provides smooth search experience with keyboard navigation and type indicators

'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Search, X, Hash, FileText, Folder } from 'lucide-react';
import { SearchSuggestion } from '../queries/get-search-suggestions';
import { useRouter } from 'next/navigation';

interface SearchWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchWithSuggestions({ 
  value, 
  onChange, 
  placeholder = "Search articles...",
  className = ""
}: SearchWithSuggestionsProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedFetchSuggestions = useDebouncedCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
    setIsLoading(false);
  }, 300);

  const debouncedOnChange = useDebouncedCallback((newValue: string) => {
    onChange(newValue);
  }, 300);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setActiveSuggestion(-1);
    setIsLoading(true);
    
    if (newValue.trim()) {
      setShowSuggestions(true);
      debouncedFetchSuggestions(newValue.trim());
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setIsLoading(false);
    }
    
    debouncedOnChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          handleSuggestionSelect(suggestions[activeSuggestion]);
        } else if (inputValue.trim()) {
          handleSearch(inputValue.trim());
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'article') {
      // Navigate to article directly
      router.push(`/articles/${suggestion.id}`);
    } else {
      // Use suggestion as search query
      const searchQuery = suggestion.text;
      setInputValue(searchQuery);
      onChange(searchQuery);
      handleSearch(searchQuery);
    }
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setInputValue('');
    onChange('');
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4 text-gray-400" />;
      case 'tag':
        return <Hash className="h-4 w-4 text-gray-400" />;
      case 'category':
        return <Folder className="h-4 w-4 text-gray-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim() && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow clicks
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-terracotta focus:border-transparent outline-none transition-colors"
        />
        {inputValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Searching...
            </div>
          ) : (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                    index === activeSuggestion ? 'bg-brand-sage/20' : ''
                  }`}
                >
                  {getTypeIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.type}
                      {suggestion.count && ` (${suggestion.count} articles)`}
                    </div>
                  </div>
                </button>
              ))}
              
              {inputValue.trim() && (
                <button
                  onClick={() => handleSearch(inputValue.trim())}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-t border-gray-100 transition-colors"
                >
                  <Search className="h-4 w-4 text-brand-terracotta" />
                  <div className="flex-1">
                    <div className="font-medium text-brand-terracotta">
                      Search for "{inputValue.trim()}"
                    </div>
                    <div className="text-xs text-gray-500">
                      Press Enter or click to search
                    </div>
                  </div>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}