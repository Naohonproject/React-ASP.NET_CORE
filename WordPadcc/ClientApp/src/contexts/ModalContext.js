import { createContext, useReducer, useState } from "react";

import contentReducer from "../reducers/contentReducer";
import messageReducer from "../reducers/messageReducer";

export const ModalContext = createContext();

export default ({ children }) => {
  const [modalShow, setModalShow] = useState(null);
  const [content, dispatch] = useReducer(contentReducer, {
    Content: "",
    Password: "",
    Url: "",
    Id: "",
    IsModified: false,
  });
  const [message, dispatchMessage] = useReducer(messageReducer, {
    errorMessage: "",
    isLoading: false,
  });

  const [isLog, setIsLog] = false;

  const modalContextData = {
    modalShow,
    setModalShow,
    content,
    dispatch,
    message,
    dispatchMessage,
  };
  return <ModalContext.Provider value={modalContextData}>{children}</ModalContext.Provider>;
};
