import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { reset as resetForm, initialize } from 'redux-form'
import { selectedTab, showTabs } from '../common/tab/tabActions'

const BASE_URL = 'http://localhost:3003/api'
const INITIAL_VALUES = { credits: [{}], debts: [{}] }


export function getList() {
    const request = axios.get(`${BASE_URL}/billingCycles`)
    return {
        type: 'BILLING_CYCLES_FETCHED',
        payload: request
    }
}


export function create(values) {
    return submit(values, 'post')
}

export function update(values) {
    return submit(values, 'put')
}

export function remove(values) {
    return submit(values, 'delete')
}


function submit(values, method) {
    return dispatch => {
        const id = values.id ? values.id : ''
        axios[method](`${BASE_URL}/billingCycles/${id}`, values)
            .then(resp => {
                toastr.success('Sucesso', 'Operação realizada com sucesso!')
                dispatch(init())
            }).catch(msgErro => {
                toastr.error('Error', msgErro.response.data)
            })
    }
}

export function showUpdate(billingCycle) {
    return changeTabs(billingCycle, 'tabUpdate')
}

export function showDelete(billingCycle) {
    return changeTabs(billingCycle, 'tabDelete')
}

function changeTabs(billingCycle, tab) {
    return [
        showTabs(tab),
        selectedTab(tab),
        initialize('billingCycleForm', billingCycle)
    ]
}


export function init() {
    return [
        showTabs('tabList', 'tabCreate'),
        selectedTab('tabList'),
        getList(),
        initialize('billingCycleForm', INITIAL_VALUES)
    ]
}