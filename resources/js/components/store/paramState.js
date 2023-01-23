import { atom, selector, atomFamily, selectorFamily } from 'recoil';

export const paramState = atomFamily({
  key : 'paramState',
  default : {
    paginate: {},
    filter: {},
    sort: {},
    scope: null
  } 
});

// export const ParamScopeSelector = selector({
//   key: 'ParamScopeSelector',
//   // 複数のatomの値を組み合わせて返す
//   get: ({get}) => {
//     const param = get(paramState(model))
//     const scope = get(scopeState)
//     return {param, scope}
//   }
// });