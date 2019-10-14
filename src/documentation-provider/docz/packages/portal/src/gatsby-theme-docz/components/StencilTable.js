import React from 'react';

const StencilTable = ({props = [], columns = [], tableType = ''}) => {
  if (!Array.isArray(props) || !Array.isArray(columns)) {
    return null;
  } else if (props.length === 0) {
    return <EmptyTable tableType={tableType} />
  }

  const flexRow = getFlexRowStyle(columns);

  return (
    <div style={styles.table} role={'table'}>
      <div className={'stable-table-head'} style={flexRow} role={'rowgroup'}>
        {columns.map((column) =>
          <div
            className={'stencil-table-column-header'}
            key={`column-${column.name}`}
            style={styles.headerCell}
          >{column.name}</div>
        )}
      </div>

      {props.map((prop, i) =>
        <div className={'stencil-row'} role={'rowgroup'} style={flexRow} key={`stencil-row-${i}`}>
          {columns.map((column) =>
            <div
              className={'stencil-column-cell'}
              key={`stencil-column-${column.name}-cell-${i}`}
              style={styles.cell}
              role={'cell'}
            >
              { getValue(prop, column) }
            </div>
          )}
        </div>
      )}
    </div>
  )
};

export default StencilTable;

const EmptyTable = ({ tableType }) => {
  return <div
    className={'stencil-column-cell'}
    style={{...styles.cell, background: '#ccc'}}
  >
    No {tableType} defined
  </div>
};

function getValue (prop, column) {
  if (prop[column.name]) {
    return prop[column.name].toString()
  } else if (column.default) {
    return column.default
  }

  return ''
}

function getFlexRowStyle (columns) {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, ${100 / columns.length}%)`,
    gridTemplateRows: '100% auto',
  }
}

const styles = {
  table: {
    display: 'block',
    background: '#f0f0f0',
    border: '1px solid black'
  },
  headerCell: {
    background: '#ccc',
    border: '1px solid black',
    padding: '2px'
  },
  cell: {
    border: '1px solid black',
    padding: '2px'
  }
}
