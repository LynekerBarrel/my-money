import React from 'react'
import { HashRouter } from 'react-router-dom'
import Header from '../common/template/header'
import SideBar from '../common/template/sidebar'
import Footer from '../common/template/footer'
import Routes from './routes'
import Notification from '../common/notification/notification'

export default props => (
    <HashRouter>
        <div className='wrapper'>
            <Header />
            <SideBar />
            <Routes />
            <Footer />
            <Notification />
        </div>
    </HashRouter>
)