/*
  棋谱组件（无状态组件）
*/

import { RecordList } from 'src/types/types'
import React, { Component } from 'react'
import { RecordContainer } from '../style'

type RecordHistoryProps = {
  recordList: RecordList
}
type RecordHistoryState = {}

export default class RecordHistory extends Component<RecordHistoryProps, RecordHistoryState> {
  render () {
    return (
      <RecordContainer>
        <ul>
          {
            this.props.recordList.map((item, index) => {
              return (
                <li key={index}>{item}</li>
              )
            })
          }
        </ul>
      </RecordContainer>
    )
  }
}