import React from 'react';
import ReactDOM from 'react-dom';
import { DataTable } from 'react-data-components';

class Table extends React.Component{
  constructor(props) {
    super(props);

    this.buildTable = this.buildTable.bind(this);
    this.updateData = this.updateData.bind(this);
    this.state = {
      rows: "",
      isLoading: false,
    };
  }

  buildTable(data) {
    const allRowsUrls = {};
    const allRowsTools = {};

    for (const [val, row] of data.entries()) {
      const getResultUrls = [];
      const tools = row.tools;
      const id = row.id;
      for (const [index, value] of tools.entries()) {
        getResultUrls.push(<a href={`/results/${this.props.sessionId}/${id}/${value}`}>
          {value}
        </a>);
      }
      const htmlUrls = getResultUrls.map((url) =>
        <p>{url}</p>
      );
      allRowsUrls[id] = htmlUrls;
    }

    const renderResultsUrl =
      (val, row) => allRowsUrls[row["id"]];

    for (const [val, row] of data.entries()) {
      const getTools = [];
      const tools = row.tools;
      for (const [index, value] of tools.entries()) {
        getTools.push(<p>{value}</p>);
      }
      allRowsTools[row.id] = getTools;
    }

    const renderTools =
      (val, row) => allRowsTools[row["id"]];

    const tableColumns = [
      { title: 'ID', prop: 'id' },
      { title: 'Filename', prop: 'filename' },
      { title: 'Tools', render: renderTools, className: 'text-center' },
      { title: 'Results', render: renderResultsUrl, className: 'text-center' },
      { title: 'Report', prop: 'report', defaultContent: 'no report available' },
    ];

    return ( <div>
        <button onClick={this.updateData}>
          Activate Lasers
        </button>
        <DataTable
          className="container"
          keys="id"
          columns={tableColumns}
          initialData={data}
          initialPageLength={10}
          initialSortBy={{ prop: 'filename', order: 'descending' }}
          //pageLengthOptions={[ 5, 20, 50 ]}
        />
      </div>
    );
  }

  componentDidMount() {
    this.updateData()
  }

  updateData() {
    this.setState({ isLoading: true });
    console.log('table session:' + this.props.sessionId);
    fetch('/ids/' + this.props.sessionId)
      .then(res => res.json())
      .then((rows) => {
        ReactDOM.render(this.buildTable(rows), document.getElementById('table'));
      })
      .then(data => this.setState({ rows: data, isLoading: false }));
  }

  render() {
    const { hits, isLoading } = this.state;

    if (isLoading) {
      return ( <div><button onClick={this.updateData}>
          Activate Lasers
        </button><p>Loading ...</p></div>
      );
    }
    return null;
  }
}

export default Table
