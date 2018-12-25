var env = process.env.NODE_ENV || 'development';

// changed localhost to 127.0.0.1 in order  to reduce lookup time caused for localhost to be chaged to 127.0.0.1
// Read more: https://hackernoon.com/how-changing-localhost-to-127-0-0-1-sped-up-my-test-suite-by-1-800-8143ce770736
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = 'mongodb://127.0.0.1:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGOLAB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest';
}
