import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import './Tool.css'

class CodeEditor extends Component {
  render () {
    let { id, onChange = () => {}, data = '', mode = 'javascript', validate = true } = this.props
    const onChangeDebounce = debounce(onChange, 1000, { 'maxWait': 5000 })
    return (
      <AceEditor
        ref={ref => { this.code = ref }}
        className='code-editor'
        mode={mode}
        theme='monokai'
        showPrintMargin={false}
        name={'' + id}
        onChange={onChangeDebounce}
        value={data}
        setOptions={{
          maxLines: 20,
          useWorker: validate
        }}
      />
    )
  }
}

class Tool extends Component {
  constructor (props) {
    super(props)
    this.state = {
      transfer: 'Transfer',
      input: `platform:2
limit:10
start_time:1521561600
end_time:1522080000
offset:0`,
      output: ''
    }
  }
  render () {
    let {input, output} = this.state
    return (
      <div className='Tool row'>
        <div className='col-5'>
          <div className='header'>
            <span className='title'>key:value pairs</span>
          </div>
          <CodeEditor
            id='input'
            validate={false}
            onChange={this.onInputChange}
            data={input}
            ref={ref => { if (ref) { this.code = ref.code } }}
          />
        </div>
        <div className='col-2 action'>
          <button type='button' className='btn btn-secondary' onClick={this.handleClickTransferButton}>
            {this.state.transfer}
          </button>
        </div>
        <div className='col-5'>
          <div className='header'>
            <span className='title'>json format</span>
          </div>
          <CodeEditor
            id='output'
            data={output}
          />
        </div>
      </div>
    )
  }
  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  onInputChange = newValue => {
    console.log('newValue is', newValue)
    this.setState({
      input: newValue
    })
  }
  handleClickTransferButton = async () => {
    this.code && this.code.editor.blur()
    this.setState({
      transfer: 'Waiting…'
    })
    await this.sleep(1000)
    this.setState({
      transfer: 'Transfer',
      output: this.strToJSON(this.state.input)
    })
  }
  strToJSON = (str) => {
    let commaAdded = str.replace(/(?:\r\n|\r|\n)/g, ',').trim().replace(/,+$/g, '')
    let items = commaAdded.split(',')
    let jsonString = items.map(item => {
      return item.replace(/([^:]+)(:)(.+$)/, (match, p1, p2, p3) => {
        return `"${p1.trim()}": "${p3.trim()}"`
      })
    }).join(', ')
    try {
      return JSON.stringify(JSON.parse(`{${jsonString}}`), null, 2)
    } catch (err) {
      this.setState({
        transfer: 'Error，Try again'
      })
    }
  }
}

export default Tool
