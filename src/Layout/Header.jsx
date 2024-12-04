import React from 'react'
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const handleHeaderClick = ()=> {
    navigate('/');
  }

  return (
    <div onClick={handleHeaderClick} className='cursor-pointer py-5'>YouTube Comment Finder</div>
  )
}

export default Header