const bs = require('browser-sync').create(),
      path = require('path'),
      childProcess = require('child_process');

const cwd = process.cwd();

const dir = path.resolve(cwd, './src');

bs.init({
  server: dir,
  ghostMode: true,
  startPath: '/example.html',
  logLevel: 'warn',
});

bs.watch(path.resolve(dir, './*')).on('change', bs.reload);

bs.watch(path.resolve(cwd, './node_modules/*')).on('change', function () {
  console.log('Running pnpm run prepare');
  childProcess.exec('pnpm run prepare', {}, (error, stdout, stderr) => {
    if (stdout) {
      bs.reload(arguments);
    }
  });
});
