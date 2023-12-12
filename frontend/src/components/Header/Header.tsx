import styles from './Header.module.css';



const Header: React.FC = () => {

    const logo = './logo192.png';

    return (
        <div className={styles.header}>
            <div className={styles.ms_logo_and_text}>
                <img className={styles.ms_logo} src={logo} alt="MS Logo" />
                <i className={styles.header_text}>Your App Name Goes Here</i>
            </div>
        </div>
    )
}



export default Header;