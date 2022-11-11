import React from "react";
import { useContext, useState, useEffect } from "react";

import "./style.css";
import { ModalContext } from "../../contexts/ModalContext";

const index = () => {
  const {
    content: { Content },
  } = useContext(ModalContext);

  // const [value, setValue] = useState(Content);
  // const [value, setValue] = useState("");

  // const handleOnChange = (e) => {
  //   setValue(e.target.value);
  // };

  // useEffect(() => {
  //   const timeOutId = setTimeout(() => {
  //     console.log(value);
  //   }, 1000);
  //   return clearTimeout(timeOutId);
  // }, [value]);

  const [value, setValue] = useState("");

  const handleOnChange = (event) => {
    setValue(event.target.value);
  };

  // value change
  // useEffect callback is called => clean up function call with value of previous state =>statements inside useEffect is called
  useEffect(() => {
    // statements will run after component render and dependency change
    const timeoutId = setTimeout(
      () => console.log(`I can see you're not typing. I can use "${value}" now!`),
      1000
    );
    // clean up function of previous state run, means timeOutId is the previous timeoutId
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="body-container">
      <div className="document-container">
        <textarea onChange={handleOnChange} value={value} className="input-control"></textarea>
      </div>
    </div>
  );
};

export default index;
