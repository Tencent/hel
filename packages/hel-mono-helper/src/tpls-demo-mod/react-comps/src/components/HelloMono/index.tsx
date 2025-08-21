import { randomNum } from '@mc/utils';
import styles from './index.module.css';

const svgUrl = 'https://tnfe.gtimg.com/hel/@tencent/mono-comps@20250816051000/static/media/logo.6ce24c58023cc2f8fd88fe9d219db6c6.svg';

interface IProps {
  name?: string;
}

const Link = (props: { label: string; href: string }) => (
  <a className={styles.link} href={props.href} target="_blank" rel="noopener noreferrer">
    {props.label}
  </a>
);

export function HelloMono(props: IProps) {
  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        HelloMono component header{props.name || ''}
        <b> random num {randomNum()}</b>
        <img src={svgUrl} className={styles.logo} alt="logo" />
        <Link label="Learn React" href="https://reactjs.org" />
        <Link label="Learn Hel Micro" href="https://github.com/Tencent/hel" />
      </header>
    </div>
  );
}
