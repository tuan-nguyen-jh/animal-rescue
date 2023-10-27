import React from 'react';

import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

import { ANIMAL_TABLE_COLUMN_FORMAT } from '../../../../config/configBookingService';

const START_ROW_INDEX = 0;

export default function SpreadSheet (props) {
  const { rows, setSpread } = props;

  const hostStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid darkgray'
  };

  const initSpread = (spread) => {
    setSpread(spread);

    const sheet = spread.getActiveSheet();
    sheet.reset();
    ANIMAL_TABLE_COLUMN_FORMAT.map((column) => {
      sheet.setValue(START_ROW_INDEX, column.index, column.name);
    })

    rows.map((row, index) => {
      ANIMAL_TABLE_COLUMN_FORMAT.map((column)=>{
        sheet.setValue(index + 1, column.index, row[column.key]);
      });
    });
   
  }

  return (
      <SpreadSheets workbookInitialized={spread => initSpread(spread)} hostStyle={hostStyle}>
        <Worksheet></Worksheet>
      </SpreadSheets>
  );
}