import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getSummary } from './dashboardActions'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import ValueBox from '../common/widget/valueBox'
import Row from '../common/layout/row'

class DashBoard extends Component {
    componentWillMount() {
        this.props.getSummary()
    }
    render() {
        const { CreditSum, DebtSum } = this.props.summary
        return (
            <div className="" >
                <ContentHeader title='Dashboard' subtitle='Versão 1.0' />
                <Content>
                    <Row>
                        <ValueBox
                            cols='12 4'
                            color='green'
                            value={`R$ ${CreditSum}`}
                            text='Total de Créditos'
                            icon='bank'
                        />
                        <ValueBox
                            cols='12 4'
                            color='red'
                            value={`R$ ${DebtSum}`}
                            text='Total de Débitos'
                            icon='credit-card'
                        />
                        <ValueBox
                            cols='12 4'
                            color='blue'
                            value={`R$ ${CreditSum - DebtSum}`}
                            text='Valor Consolidado'
                            icon='money'
                        />
                    </Row>
                </Content>
            </div >
        )
    }
}

const mapStateToProps = state => ({ summary: state.dashboard.summary })
const mapDispatchToProps = dispatch => bindActionCreators({ getSummary }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard)
