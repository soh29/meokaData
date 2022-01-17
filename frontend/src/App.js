import React, { Component } from 'react';
import Tabs from "./components/Tabs";
import "./App.css";

class App extends Component {
  render()  {
    return (
      <div>

        <h1>Meoka Demo</h1>
        <Tabs>
        <div label="식량작물"></div>
        <div label="채소류"></div>
        <div label="특용작물"></div>
        <div label="과일류"></div>
        <div label="축산물"></div>
        <div label="수산물"></div>
        </Tabs>
        
      </div>
    )
  }

  /*
  constructor(props) {
    super(props);
    this.state = {
      view: "",
      viewCode: "100",
      itemList: [],
      p_regday: "",
      modal: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
    };
    
    //alert('constructor');
  }

  componentDidMount() {
    this.refreshList();
    //alert('componentDidMount');
  }

  refreshList = () => {
    axios
      .get("http://localhost:8000/api/tutorials/" + this.state.viewCode)
      .then((res) =>
        this.setState({ 
          itemList: res.data.data.item,
          p_regday: res.data.condition[0].p_regday
        }))
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/todos/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  display = (status) => {
  
    if(status === "식량작물")
      return this.setState({viewCode: "100"})
    else if(status === "채소류")
      return this.setState({viewCode: "200"})
    else if(status === "특용작물")
      return this.setState({viewCode: "300"})
    else if(status === "과일류")
      return this.setState({viewCode: "400"})
    else if(status === "축산물")
      return this.setState({viewCode: "500"})
    else if(status === "수산물")
      return this.setState({viewCode: "600"})

    //return this.setState({ view: status });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.display("식량작물")}
          className={this.state.viewCode === "100" ? "nav-link active" : "nav-link"}
        >
          식량작물
        </span>
        <span
          onClick={() => this.display("채소류")}
          className={this.state.viewCode === "200" ? "nav-link active" : "nav-link"}
        >
          채소류
        </span>
        <span
          onClick={() => this.display("특용작물")}
          className={this.state.viewCode === "300" ? "nav-link active" : "nav-link"}
        >
          특용작물
        </span>
        <span
          onClick={() => this.display("과일류")}
          className={this.state.viewCode === "400" ? "nav-link active" : "nav-link"}
        >
          과일류
        </span>
        <span
          onClick={() => this.display("축산물")}
          className={this.state.viewCode === "500" ? "nav-link active" : "nav-link"}
        >
          축산물
        </span>
        <span
          onClick={() => this.display("수산물")}
          className={this.state.viewCode === "600" ? "nav-link active" : "nav-link"}
        >
          수산물
        </span>
      </div>
    );
  };

  renderItems = () => {
    
    const { view } = this.state;
    const newItems = this.state.itemList.filter(
      (item) => true === true
    );

    return newItems.map((item) => (
      <tr key={item.item_code + '-' + item.kind_code + '-' + item.rank_code}>
        <td>{item.item_name}/{item.kind_name}/{item.rank}</td>
        <td>{item.unit}</td>
        <td>{item.dpr1}</td>
        
        <td>%</td>
        <td>{item.dpr2}</td>
        <td>{item.dpr5}</td>
        <td>{item.dpr6}</td>
      </tr>
    ));

  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <table>
                <thead>
                  <tr>
                    <th>품목</th>
                    <th>단위</th>
                    <th>가격({this.state.p_regday.substring(5)})</th>
                    <th>등락률</th>
                    <th>전일</th>
                    <th>1개월전</th>
                    <th>1년전</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderItems()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
  */
}

export default App;