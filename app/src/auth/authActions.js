import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import consts from '../consts'

export function login(values) {
    return submit(values, `${consts.OAPI_URL}/login`)
}

export function signup(values) {
    return submit(values, `${consts.OAPI_URL}/signup`)
}

function submit(values, url) {
    return dispatch => {
        axios.post(url, values).then(resp => {
            dispatch([
                { type: 'USER_FETCHED', payload: resp.data }
            ])
        }).catch(msgErro => {
            toastr.error('Erro', msgErro.response.data)
        })
    }
}

export function logout() {
    return { type: 'TOKEN_VALIDATED', payload: false }
}

export function validateToken(token) {
    return dispatch => {
        if (token) {
            axios.post(`${consts.OAPI_URL}/validatetoken`, { token })
                .then(resp => {
                    dispatch({ type: 'TOKEN_VALIDATED', payload: resp.data.valid })
                })
                .catch(e => dispatch({ type: 'TOKEN_VALIDATED', payload: false }))
        } else {
            dispatch({ type: 'TOKEN_VALIDATED', payload: false })
        }
    }
}