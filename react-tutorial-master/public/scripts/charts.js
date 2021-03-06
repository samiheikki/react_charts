// tutorial1.js
var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadValuesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadValuesFromServer();
    setInterval(this.loadValuesFromServer, this.props.pollInterval);
  },
  handleValuesSubmit: function(value) {
    var values = this.state.data;
    // Optimistically set an id on the new comment. It will be replaced by an
    // id generated by the server. In a production application you would likely
    // not use Date.now() for this and would have a more robust system in place.
    value.id = Date.now();
    var newValues = values.concat([value]);
    this.setState({data: newValues});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: value,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: values});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
      <h1>Comments</h1>
        <CommentList data={this.state.data} />


    <vaadin-scatter-chart id="basic-3d-scatter">
    <title>Scatterbox</title>

    <chart margin="100">
        <options3d enabled="true" alpha="10" beta="30" depth="250" view-distance="5">
            <frame3d>
                <bottom size="1" color="rgba(0,0,0,0.02)"></bottom>
                <back size="1" color="rgba(0,0,0,0.04)"></back>
                <side size="1" color="rgba(0,0,0,0.06)"></side>
            </frame3d>
        </options3d>
    </chart>

    <plot-options>
        <scatter width="10" height="10" depth="10" color-by-point="true">
        </scatter>
    </plot-options>

    <y-axis min="0" max="10" title="null">
    </y-axis>

    <x-axis min="0" max="10" grid-line-width="1">
    </x-axis>

    <z-axis min="0" max="10" show-first-label="false">
    </z-axis>

    <legend enabled="false"></legend>

    <data-series name="Reading">
      <CustomDataList data={this.state.data}/>
    </data-series>
    </vaadin-scatter-chart>


      <CommentForm onCommentSubmit={this.handleValuesSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment x={comment.x} y={comment.y} z={comment.z} key={comment.id}>
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});


// NOTE I WANT THIS TO WORK
var CustomDataList = React.createClass({
  render: function() {
    var dataTags = this.props.data.map(function(comment) {
      //return [comment.x, comment.y, comment.z];
      return '[' + comment.x + ',' + comment.y + ',' + comment.z + ']';
    });
    var i = 0;
    var htmlDatatag = '';
    dataTags.forEach(function(tag) {
      if (i !== 0) {
        htmlDatatag += ','
      }
      htmlDatatag += tag;
      i++;
    });
    return (
      React.createElement('data', {className: "commentBox"},
        htmlDatatag
      )
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {x: '', y: '', z: ''};
  },
  handleXChange: function(e) {
    this.setState({x: e.target.value});
  },
  handleYChange: function(e) {
    this.setState({y: e.target.value});
  },
  handleZChange: function(e) {
    this.setState({z: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var x = parseInt(this.state.x);
    var y = parseInt(this.state.y);
    var z = parseInt(this.state.z);
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      return;
    }
    this.props.onCommentSubmit({x: x, y: y, z: z});
    this.setState({x: '', y: '', z: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="number"
          placeholder="X"
          value={this.state.x}
          onChange={this.handleXChange}
        />
        <input
          type="number"
          placeholder="Y"
          value={this.state.y}
          onChange={this.handleYChange}
        />
        <input
          type="number"
          placeholder="Z"
          value={this.state.z}
          onChange={this.handleZChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({

  render: function() {
    return (
      <div className="comment">
      <p>x: {this.props.x}</p>
      <p>y: {this.props.y}</p>
      <p>z: {this.props.z}</p>
      </div>
    );
  }
});
ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);
