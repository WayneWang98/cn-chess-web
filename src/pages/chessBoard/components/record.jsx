/*
  棋谱组件（无状态组件）
*/

import React, { Component } from 'react'
import { RecordContainer } from '../style'

export default class Record extends Component {
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