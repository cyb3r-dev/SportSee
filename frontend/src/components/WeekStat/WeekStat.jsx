import styles from './WeekStat.module.css';

export default function WeekStat({ desc, value, valueColor, unit, unitColor }) {
    return (
        <div className={styles.weekStat}>
            <span>{desc}</span>
            <div className={styles.stat}>
                <h4 className={styles.value} style={{color: valueColor}}>{value}</h4>
                <span className={styles.unit} style={{color: unitColor}}>{unit}</span>
            </div>
        </div>
    );
}