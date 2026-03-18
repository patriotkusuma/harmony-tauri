import ChatUi from 'components/Card/ChatUi'
import MyLayout from 'layouts/MyLayout'
import React from 'react'
import { Container, Row } from 'reactstrap'

const Message = () => {
  const isMobile = window.innerWidth < 768;
  return (
    <>
        <header className='bg-gradient-info pb-8 pt-5 p5-md-8'>

        </header>

        <Container className={isMobile? 'mt--9 mb-0 pb-0' : 'mt--7'} fluid>
            <ChatUi />
        </Container>
    </>
  )
}

export default Message