/* eslint-disable import/prefer-default-export */
import { createContext } from 'rax';
import { RootContext } from '../types/interface';

export const SchemaContext = createContext<RootContext>(null);
