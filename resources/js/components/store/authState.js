import { atom } from 'recoil';

export const authUserState = atom({
  key : 'authUserState',
  default : false
});

export const authAdminState = atom({
  key : 'authAdminState',
  default : false
});