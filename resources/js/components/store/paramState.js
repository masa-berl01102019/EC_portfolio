import { atomFamily } from 'recoil';

export const paramState = atomFamily({
  key : 'paramState',
  default : {
    paginate: {},
    filter: {},
    sort: {},
    scope: null
  } 
});