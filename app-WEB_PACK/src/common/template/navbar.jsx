import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logout } from '../../auth/authActions'

class NavBar extends Component {
    constructor(props) {
        super(props)
        this.state = { open: false }
    }

    changeOpen() {
        this.setState({ open: !this.state.open })
    }
    render() {
        const { name, email } = this.props.user
        return (
            <div className="navbar-custom-menu">
                <ul className='nav navbar-nav'>
                    <li className={`dropdown user user-menu ${this.state.open ? 'open' : ''}`} >
                        <a href="javascript:;" onClick={() => this.changeOpen()}
                            aria-expanded={this.state.open ? 'true' : 'false'}
                            className="dropdown-toggle"
                            data-toggle="dropdown">
                            <img src="https://instagram.fgvr1-1.fna.fbcdn.net/v/t51.2885-19/s150x150/30590454_204794386790781_5275881188672667648_n.jpg?_nc_ht=instagram.fgvr1-1.fna.fbcdn.net&_nc_ohc=KyNSYF2hbhAAX94IfPe&oh=c55c3100614df9c24ad699039770d0ee&oe=5E967E96"
                                className="user-image" alt="User Image" />
                            <span className="hidden-xs">{name}</span>
                        </a>
                        <ul className="dropdown-menu"
                            onMouseLeave={() => this.changeOpen()}>
                            <li className="user-header">
                                <img src="https://instagram.fgvr1-1.fna.fbcdn.net/v/t51.2885-19/s150x150/30590454_204794386790781_5275881188672667648_n.jpg?_nc_ht=instagram.fgvr1-1.fna.fbcdn.net&_nc_ohc=KyNSYF2hbhAAX94IfPe&oh=c55c3100614df9c24ad699039770d0ee&oe=5E967E96"
                                    className="img-circle" alt="User Image" />
                                <p>{name}<small>{email}</small></p>
                            </li>
                            <li className="user-footer">
                                <div className="pull-right">
                                    <a href="#" onClick={this.props.logout}
                                        className="btn btn-default btn-flat">Sair</a>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = state => ({ user: state.auth.user })
const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)