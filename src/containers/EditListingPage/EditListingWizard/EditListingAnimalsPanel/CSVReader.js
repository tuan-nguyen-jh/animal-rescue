import React from "react";

import CSVSelector from "./CSVSelector";
import SpreadSheet from "./SpreadSheet";

import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

const CSVReader = (props) => {
  const { setData, data, spread, setSpread } = props;
  return (
    <>
      <CSVSelector onChange={(_data) => setData(_data)} spread={spread} rows={data} />
      <SpreadSheet rows={data} setSpread={setSpread}/>
    </>
  );
};

export default CSVReader;