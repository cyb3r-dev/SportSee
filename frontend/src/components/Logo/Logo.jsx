import styles from './Logo.module.css';

export default function Logo() {
    return (
        <div className={styles.logo}>
            <img src="/images/icon.svg" alt="SportSee Icon"/>
            <img src="/images/logo.svg" alt="SportSee Logo"/>
        </div>
    );
}