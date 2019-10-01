import React from 'react';
import { shallow } from 'enzyme';
import Store from 'statux';
import Counter from './Counter';

jest.mock('statux');

it('renders without crashing', () => {
  const component = shallow(<Counter />);
  expect(component).toMatchSnapshot();
});

it('render user name', () => {
  const user = { name: 'John' };
  const setUser = jest.fn();
  Store.useStore = jest.fn(() => [user, setUser]);
  const component = shallow(<Counter />);
  expect(component).toMatchSnapshot();
});

it('calls setUser on click', () => {
  const user = null;
  const setUser = jest.fn();
  Store.useStore = jest.fn(() => [user, setUser]);
  const component = shallow(<Counter />);
  component.find('button').simulate('click');

  expect(setUser).toHaveBeenCalledTimes(1);
  expect(setUser).toHaveBeenCalledWith({ name: 'Maria' });
});
