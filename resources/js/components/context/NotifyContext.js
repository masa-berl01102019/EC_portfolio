import React, { createContext, useState, useContext, useRef } from 'react';
import { NotifyPopup } from '../molecules/Popup/NotifyPopup';

const NotifyContext = createContext();

export default function useNotify() {
  return useContext(NotifyContext);
}

export function NotifyProvider({ children }) {
  // Manage initial value of popup
  const [notify, setNotify] = useState({ isOpen: false });
  // Call useRef because values and functions want to retain during rendering between components.
  const func = useRef();
  // The reason why return promise object
  // 1. It will return value when button of popup is clicked.
  // 2. Execute next process after catching value that button return.
  // * Don't forget to use async/await functions
  const handlePromise = (data) => {
    return new Promise((resolve) => {
      setNotify({ isOpen: true, ...data });
      // Store resolve function to useRef
      func.current = (choice) => {
        // Argument(choice) will be boolean
        resolve(choice);
        // Close popup after execute resolve function 
        setNotify({ isOpen: false });
      };
    });
  }

  return (
    <NotifyContext.Provider value={handlePromise}>
      {children}
      <NotifyPopup
        title={notify?.title}
        body={notify?.body}
        confirmBtnLabel={notify?.confirmBtnLabel}
        type={notify?.type}
        isOpen={notify.isOpen}
        onClose={() => func.current(false)}
        onConfirm={() => func.current(true)}
      />
    </NotifyContext.Provider>
  );

}
