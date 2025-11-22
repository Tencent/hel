import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import exphbs from 'express-handlebars';
import logger from 'morgan';
import { APP_ROUTER } from '../../router';
import { PUBLIC_DIR, VIEWS_DIR } from '../configs/sys';
import { handleAllRequest } from './requestEntrance';

/**
 * 初始化一个 express app 对象
 */
function initApp() {
  const app = express();
  app.set('env', process.env.ENV || 'dev');

  // view engine setup
  app.set('views', VIEWS_DIR);

  app.engine('.html', exphbs({ extname: '.html' }));
  app.set('view engine', '.html');
  if (app.get('env') != 'dev') {
    // 非开发环境,开启模板缓存
    app.enable('view cache');
  }

  app.use(logger('dev'));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(compression({ filter: shouldCompress })); // 为静态资源开启gzip压缩功能,该语句必须放在下面一句之上,否则不会起效
  app.use(express.static(PUBLIC_DIR));

  function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
      return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
  }

  app.all('*', handleAllRequest);
  app.use('/', APP_ROUTER);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    res.status(404);
    res.send({ msg: `${req.url} not found` });
  });

  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  return app;
}

const APP = initApp();

export default APP;
