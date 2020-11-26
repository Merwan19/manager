import head from 'lodash/head';

export default class DedicatedServerInstallImageConfigCtrl {
  addHttpHeader() {
    this.model.httpHeader.push({
      added: false,
      model: {},
    });
  }

  /*= =============================
  =            Events            =
  ============================== */

  onHttpHeaderAddBtnClick(index) {
    this.model.httpHeader[index].added = true;
    this.addHttpHeader();
  }

  onHttpHeaderDeleteBtnClick(index) {
    this.model.httpHeader.splice(index, 1);
  }

  /* -----  End of Events  ------*/

  /*= =====================================
  =            Initialization            =
  ====================================== */

  $onInit() {
    this.model.imageType = head(this.imageTypeEnum);
    this.model.checkSumType = head(this.checksumTypeEnum);
    this.addHttpHeader();
  }

  /* -----  End of Initialization  ------*/
}
