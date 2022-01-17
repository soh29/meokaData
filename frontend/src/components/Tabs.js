import React, { Component } from "react";
import PropTypes from "prop-types";
import Tab from "./Tab";
import axios from "axios";
import Modal from "./Modal";
class Tabs extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.children[0].props.label,
      p_item_category_code: "100",
      p_regday: "",
      item:[],
      modal:false,
      data_key: "",
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



    if(tab === "식량작물")
        this.setState({p_item_category_code: "100"}, this.fetchItems)
    else if(tab === "채소류")
        this.setState({p_item_category_code: "200"}, this.fetchItems)
    else if(tab === "특용작물")
        this.setState({p_item_category_code: "300"}, this.fetchItems)
    else if(tab === "과일류")
        this.setState({p_item_category_code: "400"}, this.fetchItems)
    else if(tab === "축산물")
        this.setState({p_item_category_code: "500"}, this.fetchItems)
    else if(tab === "수산물")
        this.setState({p_item_category_code: "600"}, this.fetchItems)
    
    //alert(this.state.p_item_category_code)
    
  };
  fetchItems = () => {
    axios.get("http://192.168.0.36:8000/api/price/" + this.state.p_item_category_code)
    .then((res) => {
      this.setState({ 
        ...this.state,
        item: res.data.data.item,
        p_regday: res.data.condition[0].p_regday
      })
    })
    .catch((err) => console.log(err));
  }
  renderItems = () => {
    /*
    const newItems = this.state.item.filter(
        (item) => true === true
    );
    */
  const onClickHandler = function(e){
    //console.log(e.target.getAttribute("data-key")); //will log the index of the clicked item
    this.setState({
      modal: !this.state.modal,
      data_key: e.target.getAttribute("data-key"),
     });
  }.bind(this);
  const colorRateOfChange = function(rateOfChange)  {
    if(rateOfChange > 0)
      return <td style={{color:'red'}}>▲ {rateOfChange}%</td>
    else if(rateOfChange < 0)
      return <td style={{color:'blue'}}>▼ {Math.abs(rateOfChange)}%</td>
    else 
      return <td>-</td>
  }
    return this.state.item.map((item) => (
        <tr key={item.item_code + '-' + item.kind_code + '-' + item.rank_code}
            >
          <td data-key={this.state.p_item_category_code + '-' + item.item_code + '-' + item.kind_code + '-' + item.rank_code}
            onClick={onClickHandler}>{item.item_name}/{item.kind_name}/{item.rank}</td>
          <td>{item.unit}</td>
          <td>{item.dpr1}원</td>
          {colorRateOfChange(item.rateOfChange)}
          <td>{item.dpr2}원</td>
          <td>{item.dpr5}원</td>
          <td>{item.dpr6}원</td>
        </tr>
    ));
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
            return (
              <div>
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
                {this.state.modal? (
                  <Modal
                    toggle={this.toggle}
                    data_key = {this.state.data_key}/>
                ): null}
                </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default Tabs;
