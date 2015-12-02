import React, { Component, PropTypes } from 'react'

export default class LoadData extends Component {
  handleSubmit(e) {
    e.preventDefault();
    const node = this.refs.input;
    const text = node.value.trim();
    if (text) {
      this.props.onLoadSubmit(text)
      node.value = ''
    }
  }

  render() {
    return (
      <div class="container">
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <input type="text" ref="input" />
          <button>
            Load
          </button>
        </form>
      </div>
    )
  }
}

LoadData.propTypes = {
  onLoadSubmit: PropTypes.func.isRequired
}
