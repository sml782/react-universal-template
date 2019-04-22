const chalk = require('chalk');
const program = require('commander');

program
  .version('0.0.1')
  .usage('[options] [value ...]')
  .option('-a, --Analysis', 'Add analysis')
  .option('--dev', 'The development environment')
  .option('--prod', 'The production environment')
  // .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .parse(process.argv);

// 分析包
if (program.Analysis) {
  console.log(chalk.cyan('[PLUGIN]: enable BundleAnalyzerPlugin'));
  process.env.Analysis = true;
}

const isProd = !!program.prod;
if (isProd) {
  console.log(chalk.cyan('[ENV]: production'));
  console.log('Ready to start...');
  require('./build');
} else {
  console.log(chalk.cyan('[ENV]: development'));
  console.log('Ready to start...');
  require('./start');
}
