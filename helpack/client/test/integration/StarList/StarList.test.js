import { Row, Spin } from 'antd';
import SubApp from 'components/biz-smart/SubApp';
import { mount } from 'enzyme';
import StarList from 'pages/StarList';
import 'runConcent';

jest.mock('utils/http');

/**
 * @author fantasticsoul
 * @priority P0
 * @casetype integration
 */
describe('StarList 组件集成测试', () => {
  test(`
  1. 用户打开页面
`, (done) => {
    const wrapper = mount(<StarList />);

    process.nextTick(() => {
      wrapper.update();
      const spinIns = wrapper.find(Spin);
      const rowIns = wrapper.find(Row);
      const subAppIns = wrapper.find(SubApp);
      expect(spinIns.exists()).toBeTruthy();
      expect(rowIns.exists()).toBeTruthy();
      expect(subAppIns.exists()).toBeTruthy();
      done();
    });
  });
});
