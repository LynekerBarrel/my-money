import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'

import labelAndInput from '../common/form/labelAndInput'
import { init } from './billingCycleActions'
import ItemList from './itemList'
import Summary from './summary'

class BillingCycleForm extends Component {
    calculateSummary() {
        const sum = (acomulador, atual) => acomulador + atual
        return {
            sumOfCredits: this.props.credits.map(credit => +credit.value || 0).reduce(sum),
            sumOfDebts: this.props.debts.map(debt => +debt.value || 0).reduce(sum)
        }
    }
    render() {
        const { handleSubmit, readOnly, credits, debts } = this.props
        const { sumOfCredits, sumOfDebts } = this.calculateSummary()
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>
                    <Field name='name' component={labelAndInput} label='Nome' cols='12 4' placeholder='Informe o nome' readOnly={readOnly} />
                    <Field name='month' component={labelAndInput} label='Mês' type='number' cols='12 4' placeholder='Informe o mês' readOnly={readOnly} />
                    <Field name='year' component={labelAndInput} label='Ano' type='number' cols='12 4' placeholder='Informe o ano' readOnly={readOnly} />
                    <Summary credit={sumOfCredits} debt={sumOfDebts} />
                    <ItemList cols='12 6' list={credits} readOnly={readOnly} legenda='Créditos' field='credits' />
                    <ItemList cols='12 6' list={debts} readOnly={readOnly} legenda='Débitos' field='debts' />

                </div>
                <div className="box-footer">
                    <div className="pull-right">
                        <button type='button' className='btn btn-default' onClick={this.props.init}>Cancelar</button>
                        <button type='submit' className={`btn btn-${this.props.submitClass}`}>
                            {this.props.submitLabel}
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

BillingCycleForm = reduxForm({ form: 'billingCycleForm', destroyOnUnmount: false })(BillingCycleForm)
//Pegar valores que estão no formulario e jogar na propriedade, para isso formValueSelector
//Neste caso é necessário o actionCreator do redux form, pois neste momento os dados sao controlados pelo form e não pelo state
const selector = formValueSelector('billingCycleForm')
const mapStateToProps = state => ({
    credits: selector(state, 'credits'),
    debts: selector(state, 'debts')
})
const mapDispatchToProps = dispatch => bindActionCreators({ init }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BillingCycleForm)