import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import { Button } from "@/components/ui/button"

function Homelayout() {
  return (
    <>
      <div class="square-grid-background" />
      <div className='mx-0 md:mx-20 lg:mx-40'>
      <Header />  
      <Outlet />
      <Footer />
      </div>
    </>

  )
}

export default Homelayout