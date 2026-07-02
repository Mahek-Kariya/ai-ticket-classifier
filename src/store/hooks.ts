/**
 * store/hooks.ts
 * Typed Redux hooks — always use these instead of plain
 * useDispatch / useSelector throughout the app.
 */
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector)
