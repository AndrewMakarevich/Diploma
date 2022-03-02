import { makeAutoObservable } from "mobx";

class ModalStore {
  modalState: boolean;
  modalSearchParams: string[];
  constructor() {
    this.modalState = false;
    this.modalSearchParams = [];
    makeAutoObservable(this);
  }
}
export default ModalStore;