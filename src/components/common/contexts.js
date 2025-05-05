import React from 'react';

// Authentication context
export const AuthContext = React.createContext();

// Language context
export const LangContext = React.createContext();

// Language list
export const LANGS = [
  {
    CODE: 'vi',
    NAME: 'Tiếng Việt',
  },
  {
    CODE: 'en-US',
    NAME: 'English',
  },
];
