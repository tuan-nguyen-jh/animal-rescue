import React from "react";
import Papa from "papaparse";

import { generateStyle } from "./SpreadSheet";
import { ANIMAL_TABLE_COLUMN_FORMAT } from "../../../../config/configBookingService";

import css from "./CSVSelector.module.css"

const formatAnimalListing = (rows, headers) => {
  return rows.map(row => {
    return row.reduce((dict, item, index) => {
      const splitData = Array.isArray(item) ? item : item.split(';');
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

  const inputStyles = generateStyle();

  const handleFileChange = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      Papa.parse(file, {
        worker: true,
        complete({ data }) {
          const headers = data[0];
          const rawRows = data.slice(1);
          const rows = formatAnimalListing(rawRows, headers);

          onChange(rows);

          if (spread !== null) {
            const sheet = spread.getActiveSheet();

            sheet.reset();

            ANIMAL_TABLE_COLUMN_FORMAT.map((columnFormat) => {
              sheet.setValue(0, columnFormat.index, columnFormat.name);
            });

            rows.map((row, index) => {
              ANIMAL_TABLE_COLUMN_FORMAT.map((columnFormat) => {
                sheet.setValue(index + 1, columnFormat.index, row[columnFormat.key]);
                sheet.setStyle(index + 1, columnFormat.index, inputStyles[columnFormat.key])
              });
            });
          }
        },
      });
    }
  };
  return <input type="file" accept=".csv" className={css.customFileInput} onChange={handleFileChange} />;
};

export default CSVSelector;
