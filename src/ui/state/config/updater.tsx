import { useCallback, useEffect, useRef } from 'react';

import { useAppDispatch } from '../hooks';
import { configActions } from './reducer';
import {openapiService} from '@/background/service';

export default function ConfigUpdater() {
  const dispatch = useAppDispatch();
  useEffect(()=>{
    openapiService.getSatConfig().then(res=>{
      if(res){
        dispatch(configActions.update(res))
      }
    })
  },[])

  return null;
}
