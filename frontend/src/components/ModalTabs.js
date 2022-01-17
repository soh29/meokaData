import React, { Component } from "react";
import PropTypes from "prop-types";
import Tab from "./Tab";
import Chart from "./Chart"
import axios from "axios";
class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[0].props.label,
      category_code: "days",
      p_regday: "",
      item:[],
      modal:false,
      data:[],
    };
    
  }
  toggle = () => {
    this.setState({ modal: !this.state.modal})
  }

  componentDidMount()   {
    this.fetchItems();
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
    if(tab === "최근가격")
        this.setState({category_code: "days"}, this.fetchItems)
    else if(tab === "월평균")
        this.setState({category_code: "months"}, this.fetchItems)
    else if(tab === "연평균")
        this.setState({category_code: "years"}, this.fetchItems)
    //alert(tab)
  };

  fetchItems = () => {
    //alert(this.props.data_key + " " + this.state.category_code)
    axios.get("http://192.168.0.36:8000/api/chart/" + this.props.data_key + "/" + this.state.category_code)
    .then((res) => {
      this.setState({data: res.data})
      //console.log(res.data.price[1].item)
    })
  }

  render() {
    const {
      onClickTabItem,
      props: { children },
      state: { activeTab },
    } = this;

    return (
      <div className="tabs">
        <ol className="tab-list">
          {children.map((child) => {
            const { label } = child.props;

            return (
              <Tab
                activeTab={activeTab}
                key={label}
                label={label}
                onClick={onClickTabItem}
              />
            );
          })}
        </ol>
        <div className="tab-content">
          {children.map((child) => {
            if (child.props.label !== activeTab) return undefined;
            //return child.props.children;
            return (// 
              <Chart key={this.state.data} data={this.state.data}/>
            )
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;
