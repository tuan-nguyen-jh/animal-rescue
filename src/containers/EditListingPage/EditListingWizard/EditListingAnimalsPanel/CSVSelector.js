import React from "react";
import Papa from "papaparse";

import css from "./CSVSelector.module.css"


const CSVSelector = (props) => {
  const { onChange } = props;
  const handleFileChange = async (e) => {
    if (e.target.files) {
      try {
        const file = e.target.files[0];

        Papa.parse(file, {
          worker: true, 
          complete({ data }) {
            onChange(data);
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  return <input type="file" accept=".csv" className={css.customFileInput} onChange={handleFileChange} />;
};

export default CSVSelector;
