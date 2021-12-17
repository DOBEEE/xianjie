// interface RestProps {
//   [index:string]: any;
// }
// type Payload = string | number | boolean | Array<any> | State;
// interface State {
//   [key: string]: any;
// }

import { useFields, SchemaRender } from '../src/index';

// export type SetterFuns<T> = {[P in keyof T]: T[P]} & {
//   [key: string]: (payload: Payload, unRerender?: boolean) => void | Promise<any>;
// }
// export type Store<T> = SetterFuns<T> & {
//   state: State;
//   reducers?: Reducers;
//   actions?: Actions;
// };
// export type SFCProps<T> = RestProps & {
//   history?: any;
//   query?: any;
//   useAgroStore?: (moduleName: string) => Store<T>;
//   useSetAgroStore?: (moduleName: string) => SetterFuns<T>;
// }
// export type SFCProps<T> = FCProps<T>;

export { useFields, SchemaRender };
// export const connect: (TarComponent: Rax.FC<FCProps<any>>) => (store: IStore) => (props: any) => JSX.Element;
// export const storeConnect: (TarComponent: Rax.FC<FCProps<any>>) => (props: any) => JSX.Element;
// export const storeComponentConnect: (TarComponent: Rax.FC<FCProps<any>>) => (store: IStore) => (props: any) => JSX.Element;
// export const createStore: ({ globalSpace, models }: ProviderProps) => IStore;
// export const Provider: Rax.FC<ProviderProps>;
