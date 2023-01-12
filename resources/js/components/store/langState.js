import { atom } from 'recoil';

export const langState = atom({
  key : 'langState',
  default : localStorage.getItem('lang') || 'en'
});