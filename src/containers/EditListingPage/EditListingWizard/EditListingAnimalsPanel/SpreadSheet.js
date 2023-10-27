import React from 'react';
import GC from '@grapecity/spread-sheets';
import { SpreadSheets, Worksheet } from '@grapecity/spread-sheets-react';
import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css';

import {
  ANIMAL_TABLE_COLUMN_FORMAT,
  SIZE_FIELD_KEY,
  TYPE_OF_ANIMAL_FIELD_KEY
} from '../../../../config/configBookingService';
import { listingFields } from '../../../../config/configListing';

const START_ROW_INDEX = 0;

export const generateStyle = () => {
  const sizeStyle = new GC.Spread.Sheets.Style();
  sizeStyle.cellButtons = [
    {
      imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
      command: "openList",
      useButtonStyle: true,
    }
  ];
  sizeStyle.dropDowns = [
    {
      type: GC.Spread.Sheets.DropDownType.list,
      option: {
        items: listingFields.find(
          (field) => field.key === SIZE_FIELD_KEY
        ).enumOptions.map((option) => {
          return {
            text: option.label,
            value: option.option,
          }
        }),
      }
    }
  ];

  const typeOfAnimalStyle = new GC.Spread.Sheets.Style();
  typeOfAnimalStyle.cellButtons = [
    {
      imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
      command: "openList",
      useButtonStyle: true,
    }
  ];
  typeOfAnimalStyle.dropDowns = [
    {
      type: GC.Spread.Sheets.DropDownType.list,
      option: {
        items: listingFields.find(
          (field) => field.key === TYPE_OF_ANIMAL_FIELD_KEY
        ).enumOptions.map((option) => {
          return {
            text: option.label,
            value: option.option,
          }
        }),
      }
    }
  ];

  return {
    size: sizeStyle,
    typeOfAnimal: typeOfAnimalStyle,
  }

}

export const SpreadSheet = (props) => {
  const { rows, setSpread } = props;

  const hostStyle = {
    width: '100%',
    height: '600px',
    border: '1px solid darkgray'
  };

  const initSpread = (spread) => {
    setSpread(spread);
    const inputStyles = generateStyle();
    const sheet = spread.getActiveSheet();
    sheet.reset();
    ANIMAL_TABLE_COLUMN_FORMAT.map((column) => {
      sheet.setValue(START_ROW_INDEX, column.index, column.name);
    })

    rows.map((row, index) => {
      ANIMAL_TABLE_COLUMN_FORMAT.map((column) => {
        sheet.setValue(index + 1, column.index, row[column.key]);
        sheet.setStyle(index + 1, column.index, inputStyles[column.key]);
      });
    });
  }

  return (
    <SpreadSheets workbookInitialized={spread => initSpread(spread)} hostStyle={hostStyle}>
      <Worksheet></Worksheet>
    </SpreadSheets>
  );
}