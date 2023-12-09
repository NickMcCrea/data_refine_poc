import './Header.css';



const Header: React.FC = () => {

    const logo = './logo192.png';

    return (
        <div className="header">
            <div className="header_logo_and_text">
                <img className='ms_logo' src={logo} alt="MS Logo" />
                <i className='header_text'>Your App Name Goes Here</i>
            </div>
        </div>
    )
}



export default Header;