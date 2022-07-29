import React from "react";
import GlobalStateHandler from "../config/GlobalStateHandler";

class ShouldDeleteModal extends React.Component {
  state = {
    callBack: null,
  };

  showModal(callBack) {
    this.setState({ callBack });
  }

  render() {
    if (this.state.callBack === null) {
      return null;
    }
    return (
      <div className="modalContainer">
        <div className="modal">
          <h1 className="sureDeleteText">
            Are you sure you want to delete this product?
          </h1>
          <div className="yesNoContainer">
            <button
              className="yesButton"
              onClick={async () => {
                await this.state.callBack();
                this.setState({ callBack: null });
              }}
            >
              Yes
            </button>
            <button
              id="dontDeleteProduct"
              className="noButton"
              onClick={() => {
                this.setState({ callBack: null });
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const showShouldDeleteModal = (callBack) => {
  GlobalStateHandler.shouldDeleteModalRef.showModal(callBack);
};
export { ShouldDeleteModal, showShouldDeleteModal };
