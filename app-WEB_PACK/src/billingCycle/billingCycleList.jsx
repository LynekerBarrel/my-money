import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getList, showUpdate, showDelete } from './billingCycleActions'
import IconButton from '../common/layout/iconButton'

class BillingCycleList extends Component {
    componentWillMount() {
        this.props.getList()
    }
    renderRows() {
        const list = this.props.list || []
        return list.map(l => (
            <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.month}</td>
                <td>{l.year}</td>
                <td>
                    <IconButton color='warning'
                        onClick={() => this.props.showUpdate(l)}
                        icon='pencil' />
                    <IconButton color='danger'
                        onClick={() => this.props.showDelete(l)}
                        icon='trash-o' />
                </td>
            </tr>
        ))
    }
    render() {
        return (
            <div className="">
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Mês</th>
                            <th>Ano</th>
                            <th className='table-actions'>Opções</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => ({ list: state.billingCycle.list })
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, showDelete }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BillingCycleList)
