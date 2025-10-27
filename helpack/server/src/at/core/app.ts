import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { RequestHandler } from 'express';
import exphbs from 'express-handlebars';
import logger from 'morgan';
import path from 'path';
import handleAllRequest from './handleAllRequest';
// const restc = require('restc');
// !!!important，先引router配置，触发router定义，再引routerFactory
import '../../router';
import { router } from './routerFactory';

const app = express();
app.set('env', process.env.ENV || 'dev');

// view engine setup
app.set('views', path.join(__dirname, '../../views'));
// app.set('view engine', 'jade');

// replace jade to express-handlebars
// app.engine('.html', exphbs({
// defaultLayout: 'main2', extname: '.html', layoutsDir: path.join('../../views/layouts')}));
app.engine('.html', exphbs({ extname: '.html' }));
app.set('view engine', '.html');
if (app.get('env') != 'dev') {
  // 非开发环境,开启模板缓存
  app.enable('view cache');
}

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }) as RequestHandler);
app.use(express.urlencoded({ extended: false }) as RequestHandler);
app.use(cookieParser());
app.use(compression({ filter: shouldCompress })); // 为静态资源开启gzip压缩功能,该语句必须放在下面一句之上,否则不会起效
app.use(express.static(path.join(__dirname, '../../../public')) as RequestHandler);

function shouldCompress(req, res) {
  // console.log(`shouldCompress req.url: ${req.url}`);
  if (req.headers['x-no-compression']) {
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

// app.use(restc.express({ includes: /api\\*/ }));
app.all('*', handleAllRequest);
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  res.send({ msg: `${req.url} not found` });
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
