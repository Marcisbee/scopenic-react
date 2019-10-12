import React from 'react';
import { shallow } from 'enzyme';
import Projects from './projects';

describe('Projects', () => {
  it('renders without crashing', () => {
    const component = shallow(<Projects />);
    expect(component).toMatchSnapshot();
  });
});
