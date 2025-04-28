import { program, Argument } from 'commander';
import fs from 'fs-extra';
import path from 'node:path';
import { scaffold } from '@lib/index';
import { E_TemplateType } from './constants';
import { isString } from 'lodash';
import inquirer from 'inquirer';
import renameTargetDir from '@lib/renameTargetDir';
import createOutputDirName from '@lib/createOutputDirName';
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
    let outputDir = createOutputDirName(name, baseUrl);
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
      outputDir = createOutputDirName(name, tempDir);
    }

    // 查看目标文件夹是不是已经存在了
    if (fs.existsSync(outputDir)) {
      const resoveTypeAnswer = await inquirer.prompt({
        type: 'list',
        name: 'resoveType',
        message: '当前文件夹已经存在，请选择你需要的操作：',
        choices: [
          {
            name: '重新输入名称',
            value: 'rename',
          },
          {
            name: '重新输入文件夹路径',
            value: 'reinputDir',
          },
          {
            name: '覆盖目标文件夹',
            value: 'overwrite',
          },
          {
            name: '取消',
            value: 'cancel',
          },
        ],
      });
      if (resoveTypeAnswer.resoveType === 'cancel') {
        return;
      }
      if (resoveTypeAnswer.resoveType === 'overwrite') {
        await scaffold({
          templateDir,
          outputDir,
          targetName: name,
        });
      }
      if (resoveTypeAnswer.resoveType === 'rename') {
        const { newName } = await inquirer.prompt({
          type: 'input',
          name: 'newName',
          message: '请输入新的名称：',
        });

        await scaffold({
          templateDir,
          outputDir: renameTargetDir({
            baseUrl: outputDir,
            targetDirName: newName,
            userDirUrl: tempDir,
          }),
          targetName: newName,
        });
      }
      if (resoveTypeAnswer.resoveType === 'reinputDir') {
        const { newDir } = await inquirer.prompt({
          type: 'input',
          name: 'newDir',
          message: '请输入新的文件夹路径：',
        });
        await scaffold({
          templateDir,
          outputDir: renameTargetDir({
            baseUrl: outputDir,
            targetDirName: name,
            userDirUrl: newDir,
          }),
          targetName: name,
        });
      }
    } else {
      await scaffold({
        templateDir,
        outputDir,
        targetName: name,
      });
    }
  });

program.parse(process.argv);
