import { Route, Switch } from 'react-router-dom';

import * as page from 'configs/constant/page';
import AppStore from 'pages/AppStore';
import ClassManagement from 'pages/ClassManagement';
import CreatedList from 'pages/CreatedList';
import LatestVisit from 'pages/LatestVisit';
import NewApp from 'pages/NewApp';
import NotFound from 'pages/NotFound';
import StarList from 'pages/StarList';
import SyncAllowedApps from 'pages/SyncAllowedApps';
import SyncStaff from 'pages/SyncStaff';
import Top from 'pages/Top';
import Welcome from 'pages/Welcome';

export default function Routes() {
  return (
    <Switch>
      <Route exact path={page.STAR} component={StarList} />
      <Route exact path={page.CREATED} component={CreatedList} />
      <Route exact path={page.STORE} component={AppStore} />
      <Route exact path={page.TOP} component={Top} />
      <Route exact path={page.NEW_APP} component={NewApp} />
      <Route exact path={page.LATEST_VISIT} component={LatestVisit} />
      <Route exact path={page.INTRO} component={Welcome} />
      <Route exact path={page.SYNC_STAFF} component={SyncStaff} />
      <Route exact path={page.SYNC_ALLOWED_APPS} component={SyncAllowedApps} />
      <Route exact path={page.CLASS_MGR} component={ClassManagement} />
      {/* <Route exact path="/" component={LatestVisit} /> */}
      <Route component={NotFound} />
    </Switch>
  );
}
