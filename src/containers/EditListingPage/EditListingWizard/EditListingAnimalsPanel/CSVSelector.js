import React from "react";
import Papa from "papaparse";

import css from "./CSVSelector.module.css"

const formatAnimalListing = (rows, headers) => {
  return rows.map(row => {
    return row.reduce((dict, item, index) => {
      const splitData = Array.isArray(item)? item : item.split(';');
      if (splitData.length > 1) {
        dict[headers[index].trim()] = splitData.map((path) => path.trim());
      } else {
        dict[headers[index].trim()] = item.trim();
      }
      return dict
    }, {});
  })
}

const CSVSelector = (props) => {
  const { onChange, spread } = props;
  const handleFileChange = async (e) => {
    if (e.target.files) {
      try {
        const file = e.target.files[0];
        Papa.parse(file, {
          worker: true, 
          complete({ data }) {
            const headers = data[0];
            const rawRows =  data.slice(1);
            const rows = formatAnimalListing(rawRows, headers);
            onChange(rows);
            if (spread !== null){
              const sheet = spread.getActiveSheet();
              sheet.reset();
              sheet.setValue(0, 0, 'Name');
              sheet.setValue(0, 1, 'Type of Animal');
              sheet.setValue(0, 2, 'Size');
              sheet.setValue(0, 3, 'Date of Birth');
              sheet.setValue(0, 4, 'Images');
          
              rows.map((row, index) => {
                sheet.setValue(index + 1, 0, row.title);
                sheet.setValue(index + 1, 1, row.typeOfAnimal);
                sheet.setValue(index + 1, 2, row.size);
                sheet.setValue(index + 1, 3, row.birth);
                sheet.setValue(index + 1, 4, row.images);
              });
            }
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
