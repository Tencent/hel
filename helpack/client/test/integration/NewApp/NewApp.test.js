import { Card } from 'antd';
import EasyForm from 'components/smart/EasyForm';
import { mount } from 'enzyme';
import NewApp from 'pages/NewApp';
import 'runConcent';

jest.mock('utils/http');

/**
 * @author fantasticsoul
 * @priority P0
 * @casetype integration
 */
describe('NewApp 组件集成测试', () => {
  test(`
  1. 用户打开页面
`, (done) => {
    const wrapper = mount(<NewApp />);

    process.nextTick(() => {
      wrapper.update();
      const cardIns = wrapper.find(Card);
      const rowIns = wrapper.find(Rowv);
      const formIns = wrapper.find(EasyForm);
      expect(cardIns.exists()).toBeTruthy();
      expect(rowIns.exists()).toBeTruthy();
      expect(formIns.exists()).toBeTruthy();
      done();
    });
  });
});
