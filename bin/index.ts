import { program, Argument } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';
import { copyPage } from '@lib/index';
// 读本地package.json
const packageJson = fs.readJsonSync('./package.json');
const { version } = packageJson;
program.version(version, '-v, --version');

program
  .command('create')
  .addArgument(
    new Argument('<type>', 'Type of project to create').choices(['page', 'component', 'drawer']),
  )
  .argument('<name>', 'Name of project to create')
  .option('-d, --dir [dir]', 'Directory to create project in')
  .description('Say hello to someone')
  .action(async (type, name, options) => {
    const { dir } = options;
    // 在用户当前目录的src/pages目录下创建一个文件夹
    // fs.ensureDirSync(path.resolve(__dirname, dir ? `./src/${dir}` : `./src/pages/${name}`));
    console.log(path.resolve(process.cwd(), `./src/pages/${name}`));
    await copyPage(
      path.resolve(__dirname, '../templates/page'),
      path.resolve(process.cwd(), `./src/pages/${name}`),
      name,
    );
  });

program.parse(process.argv);
