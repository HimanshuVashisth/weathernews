import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import App, { Search, Button, Table } from './App';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {                         // Test Suite

  it('renders learn react link', () => {        // Test case [1 ... n] 
    const div = document.createElement('div');
    render(<App />, div);
  });

  test('has a valid snapshot', () => {          // Snapshot
    const component = renderer.create(<App />); // creates ${component.test.js.snap} file under __snapshots__ folder in project structure

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Search', () => {

  it('Search', () => {
    const div = document.createElement('div');
    render(<Search>Search</Search>, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Search>Search</Search>);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});


describe('Button', () => {

  it('Button', () => {
    const div = document.createElement('div');
    render(<Button>More Button</Button>, div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Button>Button</Button>);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe('Table', () => {

  const props = {
    list: [
      { title: '1', author: '1', num_comments: 1, points: 2, objectID: 10001 },
      { title: '2', author: '2', num_comments: 1, points: 2, objectID: 10002 },
    ],
  };

  it('Table', () => {
    const div = document.createElement('div');
    render(<Table {...props} />, div);
  });

  it('shows two items in the list', () => {
    const element = shallow(<Table {...props} />)
    expect(element.find('.table-row').length).toBe(2);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<Table {...props} />);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
