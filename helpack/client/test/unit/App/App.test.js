import App from 'App';
import { shallow } from 'enzyme';

jest.mock('utils/http');
/**
 * @author billyjwang
 * @priority P0
 * @casetype unit
 */
describe('App 组件单元测试', () => {
  test('生成 App 组件快照', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});
