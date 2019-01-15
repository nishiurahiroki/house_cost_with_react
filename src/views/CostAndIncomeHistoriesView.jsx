import React, {useEffect, useState} from 'react'

import CostRepository from '../repositories/CostRepository'
import IncomeRepository from '../repositories/IncomeRepository'

import CostAndIncomeList from '../components/CostAndIncomeList.jsx'

import Snackbar from '@material-ui/core/Snackbar'
import NowLoading from '@material-ui/core/CircularProgress';

import { connect } from 'react-redux'

const alignCenter = {
  textAlign : 'center'
}

const HouseCostHistoriesView = props => {
  const [isLoading, showLoading] = useState(true)

  const showList = async () => {
    showLoading(true)
    const costs = await CostRepository.getCosts({ userId : props.activeAuthUserId })
    const incomes = await IncomeRepository.getIncomes({ userId : props.activeAuthUserId })
    props.showList({costs, incomes})
    showLoading(false)
  }

  useEffect(async () => {
    props.changeTitle('入出費一覧')
    await showList()
  }, [])

  const deleteCostOrIncome = async ({isCost, key}) => {
    const deleteCount = isCost ?
      await   CostRepository.delete(key) :
      await IncomeRepository.delete(key)

    if(deleteCount === 1) {
      props.showMessage('削除に成功しました')
      await showList()
    } else {
      props.showMessage('削除に失敗しました')
    }
  }

  return (
    <div style={isLoading ? alignCenter : {}}>
      {
        isLoading ?
          <NowLoading/> :
          <CostAndIncomeList
            list={props.costAndIncomeList}
            onRowDeleteClick={({isCost, id}) => deleteCostOrIncome({isCost, id})}
          />
      }
    </div>
  )
}

export default connect(
  ({costAndIncomeList, activeAuthUserId}) => ({costAndIncomeList, activeAuthUserId}),
  {
    changeTitle : title => ({ type : 'ChangeTitle', title}),
    showList : ({costs, incomes}) => (
      {
        type : 'ShowCostAndIncomeList',
        costs,
        incomes
      }
    ),
    showMessage : messageText => ({ type : 'ShowMessage', messageText })
  }
)(HouseCostHistoriesView)
