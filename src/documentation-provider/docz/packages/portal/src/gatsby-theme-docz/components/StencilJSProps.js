import React from 'react';
import StencilTable from './StencilTable';

class StencilProps extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      data: {},
      error: '',
    };
  }

  componentDidMount () {
    this.fetchComponentMetadata()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    this.fetchComponentMetadata()
  }

  fetchComponentMetadata() {
    fetch('/stencil-docs/components.json')
    .then((res) => res.json())
    .then((data) => {
      const componentsData = data.components || [];
      const componentData = componentsData.find((data) => data.tag === this.props.tag);

      if (!componentData) {
        return Promise.reject(new Error('Cannot find data for tag '+ this.props.tag))
      }

      return Promise.resolve(componentData);
    })
    .then((data) => {
      if (JSON.stringify(data) !== JSON.stringify(this.state.data)) {
        this.setState({ ...this.state, data, error: '' });
      }
    })
    .catch((e) => {
      if (e.message !== this.state.error) {
        this.setState({ ...this.state, data: [], error: e.message });
      }
    })
  }

  render() {
    if (this.state.error) {
      return <div>{ this.state.error }</div>
    }

    return (
      <div>
        <h2>Props</h2>
        <StencilTable props={this.state.data.props} columns={columns.props} tableType={'props'}/>
        <br/>
        <h2>Events</h2>
        <StencilTable props={this.state.data.events} columns={columns.events} tableType={'events'}/>
        <br/>
        <h2>Methods</h2>
        <StencilTable props={this.state.data.methods} columns={columns.methods} tableType={'methods'}/>
        <br/>
        <h2>Slots</h2>
        <StencilTable props={this.state.data.slots} columns={columns.slots} tableType={'slots'}/>
        <br/>
      </div>
    )
  }
}

export default StencilProps;

const columns = {
  events: [{
    name: 'event'
  },{
    name: 'detail'
  },{
    name: 'bubbles',
    default: 'false',
  }, {
    name: 'cancelable',
    default: 'false'
  }, {
    name: 'composed',
    default: 'false'
  }],
  methods: [{
    name: 'name'
  },{
    name: 'signature'
  },{
    name: 'parameters'
  }],
  props: [{
    name: 'name'
  },{
    name: 'type'
  },{
    name: 'default'
  }, {
    name: 'mutable',
    default: 'false'
  }, {
    name: 'required',
    default: 'false'
  }],
  slots: [{
    name: 'name'
  }]
};
