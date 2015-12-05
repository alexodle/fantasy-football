import chai from 'chai';

chai.should();

global.localStorage = {
  getItem() {},
  setItem() {}
};
