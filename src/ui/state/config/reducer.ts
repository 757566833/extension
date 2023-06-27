import { createSlice } from '@reduxjs/toolkit';

import { updateVersion } from './actions';
import {IConfig} from '@/shared/types';


export const initialState: IConfig = {

};

const slice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    update(
      state,
      action: {
        payload: IConfig;
      }
    ) {
      const { payload } = action;
      state = payload
      return state;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateVersion, (state) => {
      // todo
    });
  }
});

export const configActions = slice.actions;
export default slice.reducer;

