import React from 'react';
import { Prop } from 'gatsby-theme-docz/src/components/Props'

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
      return <div>error</div>
    } else if (!this.state.data.props) {
      return null;
    }

    return (
      <div>
        { this.state.data.props.map((prop) =>
          <Prop
            propName={prop.name}
            prop={convertProp(prop)}
            getPropType={() => prop.type}
            key={prop.name}
          ></Prop>)
        }
      </div>

    )
  }
}

export default StencilProps;

function convertProp (prop) {
  return {
    ...prop,
    defaultValue: {
      value: prop.default
    },
  }
}
