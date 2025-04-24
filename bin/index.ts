import { program, Argument } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';
import { scaffold } from '@lib/index';
import { E_TemplateType } from './constants';
import { isString } from 'lodash';
// 读本地package.json
const packageJson = fs.readJsonSync('./package.json');
const { version } = packageJson;
program.version(version, '-v, --version', 'output the current version');

program
  .command('create')
  .addArgument(
    new Argument('<type>', 'Type of project to create').choices([
      E_TemplateType.PAGE,
      E_TemplateType.COMPONENT,
      E_TemplateType.DRAWER_FORM,
      E_TemplateType.CONTROL_COMPONENT,
      E_TemplateType.MODAL_FORM,
    ]),
  )
  .argument('<name>', 'Name of project to create')
  .option('-d, --dir [dir]', 'Directory to create project in')
  .description('Create a new page or component ')
  .action(async (type: E_TemplateType, name: string, options: Record<string, any>) => {
    const { dir } = options;
    const templateDir = path.resolve(__dirname, `../templates/${type}`);
    const baseUrl = type === E_TemplateType.PAGE ? 'pages' : 'components';
    let outputDir = path.resolve(process.cwd(), `./src/${baseUrl}/${name}`);
    let tempDir = dir;
    if (isString(dir)) {
      // 看看dir末尾是不是/
      if (dir.endsWith('/')) {
        tempDir = tempDir.slice(0, -1);
      }
      // 看看是不是一个文件
      if (fs.existsSync(path.resolve(process.cwd(), `${tempDir}/${name}`))) {
        throw new Error('The specified directory already exists');
      }
      // 用户指定了文件夹
      outputDir = path.resolve(process.cwd(), `${tempDir}/${name}`);
    }

    await scaffold({
      templateDir,
      outputDir,
      targetName: name,
    });
  });

program.parse(process.argv);
