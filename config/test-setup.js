
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

global.fetch = jest.fn(() => ({
  then: jest.fn(),
}));
