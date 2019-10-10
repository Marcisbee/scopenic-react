import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

describe('home', () => {
  it('renders without crashing', () => {
    const component = shallow(<Home />);
    expect(component).toMatchSnapshot();
  });
});
