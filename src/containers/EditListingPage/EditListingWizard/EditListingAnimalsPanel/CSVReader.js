import React from "react";
import AnimalsTable from "./AnimalsTable";
import CSVSelector from "./CSVSelector";

const CSVReader = (props) => {
  const { setData, rows } = props;
  return (
    <>
      <CSVSelector onChange={(_data) => setData(_data)} />
      <AnimalsTable rows={rows} />
    </>
  );
};

export default CSVReader;