import logo from '../../assets/images/2be82d9347e3aa6477d9c0c2bd6f04ea9cae5ca4.png';

const HEADER_HEIGHT = '100px'; // Define a known height for the logo header

const Header = () => {
    return (
        <header 
            className="fixed top-0 w-full flex justify-center items-center bg-white shadow-[0_10px_8px_1px_rgba(0,0,0,0.25)] z-50"
            style={{ height: HEADER_HEIGHT }} 
        >
            <div className="container mx-auto flex justify-center items-center h-full">
                <img src={logo} alt="Trustees logo" className="mx-auto w-auto h-[8rem] p-0 m-[-10px]"/>
            </div>
        </header>
    )
}

export default Header;