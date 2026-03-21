import styles from './ChartLayout.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

export default function ChartLayout({ title, subtitle, color, onPrev, onNext, period, disablePrev, disableNext, children }) {
    return (
        <div className={styles.layout}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h4 style={{ color: color }}>{title}</h4>
                    <span>{subtitle}</span>
                </div>
                <div className={styles.selector}>
                    <button className="nav" onClick={onPrev} disabled={disablePrev}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <span>{period}</span>
                    <button className="nav" onClick={onNext} disabled={disableNext}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
            {children}
        </div>
    );
}