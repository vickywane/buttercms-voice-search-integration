import React from 'react'

const navStyle = {
    height: '60px',
    width: '100%',
    background: '#384062',
    color: "#fff",
    display : 'flex',
    justifyContent : 'center',
    alignItems: 'center'
}

const Navbar = () => (
    <nav style={navStyle} >
        <h1 className="text-2xl" > ButterCMS </h1>
    </nav>
)

export default Navbar