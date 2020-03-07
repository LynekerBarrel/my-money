import React, { Component } from 'react'
import axios from 'axios'
import ContentHeader from '../common/template/contentHeader'
import Content from '../common/template/content'
import ValueBox from '../common/widget/valueBox'
import Row from '../common/layout/row'

const BASE_URL = 'http://localhost:3003/api'

export default class DashBoardReduxless extends Component {
    constructor(props) {
        super(props)
        this.state = { creditSum: 0, debtSum: 0 }
    }
    componentWillMount() {
        axios.get(`${BASE_URL}/billingCycles/summary`)
            .then(resp => this.setState(resp.data))
    }
    render() {
        const { CreditSum, DebtSum } = this.state
        return (
            < div className="" >
                <ContentHeader title='Dashboard' subtitle='Versão 2.0' />
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
