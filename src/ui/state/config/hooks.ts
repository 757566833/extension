import { AppState } from '..';
import { useAppSelector } from '../hooks';


export function useSatConfigState(): AppState['config'] {
  return useAppSelector((state) => state.config);
}

export function useSatConfig() {
  return  useSatConfigState();
}
