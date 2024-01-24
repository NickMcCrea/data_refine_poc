import styles from './Header.module.css';
import logo from '../../MS_Standard_Logo_2022_White.png'; // Import the logo


const Header: React.FC = () => {

    

    return (
        <div className={styles.header}>
            <div className={styles.ms_logo_and_text}>
                <img className={styles.ms_logo} src={logo} alt="MS Logo" />
                <i className={styles.header_text}>Talk To Your <b>{"{"}Finance{"}"}</b> Data</i>
            </div>
        </div>
    )
}



export default Header;