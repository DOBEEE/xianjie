import { createElement } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import SchemaRender from '../../components/Template';
// import styles from './index.module.css';
// import Logo from '../../components/Logo';
import schema from './schema';

export default function Home() {
  return (
    <SchemaRender schema={schema}/>
  );
}
