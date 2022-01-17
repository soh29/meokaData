import React, { Component } from "react";
import Tabs from "./ModalTabs"
import {

  Modal,
  ModalHeader,
  ModalBody,

} from "reactstrap";

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }
  componentDidMount() {
    //alert(this.props.data_key)
  }
  handleChange = (e) => {
    let { name, value } = e.target;

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    }

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Graph</ModalHeader>
        <ModalBody>
          <Tabs data_key={this.props.data_key}>
          <div label="최근가격"></div>
          <div label="월평균"></div>
          <div label="연평균"></div>
          </Tabs>
        </ModalBody>
      </Modal>
    );
  }
}