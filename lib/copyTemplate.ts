import path from 'path';
import fse from 'fs-extra';
import { E_TemplateType } from 'bin/constants';

interface ScaffoldOptions {
  templateDir: string;
  outputDir: string;
  targetName: string;
  popUpName?: string;
  textExtensions?: string[];
}

const DEFAULT_TEXT_EXTS = ['.js', '.ts', '.tsx', '.json', '.html', '.css', '.scss', '.less'];

// 复制模版
export async function scaffold(options: ScaffoldOptions): Promise<void> {
  const { templateDir, outputDir, targetName, popUpName } = options;
  const textExts = new Set(options.textExtensions || DEFAULT_TEXT_EXTS);

  // 清空并创建目标目录
  await fse.remove(outputDir);
  await fse.ensureDir(outputDir);

  // 开始处理根目录
  await processDirectory({
    srcDir: templateDir,
    destDir: outputDir,
    targetName,
    textExts,
    popUpName,
  });
}

export type ProcessDirectoryParams = {
  srcDir: string;
  destDir: string;
  targetName: string;
  textExts: Set<string>;
  popUpName?: string;
};
async function processDirectory({
  srcDir,
  destDir,
  targetName,
  textExts,
  popUpName,
}: ProcessDirectoryParams): Promise<void> {
  // 读取源目录下所有条目
  const entries = await fse.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    let processedName = entry.name;
    const tempName = entry.name.startsWith('CreateOrEdit') && popUpName ? popUpName : targetName;

    if (entry.name.includes('TargetName')) {
      processedName = entry.name.replace(/TargetName/g, tempName);
    } else if (entry.name.includes('targetName')) {
      processedName = entry.name.replace(
        /targetName/g,
        tempName?.charAt(0).toLowerCase() + tempName.slice(1),
      );
    }

    const destPath = path.join(destDir, processedName);

    if (entry.isDirectory()) {
      // 处理目录：创建目录后递归处理
      await fse.ensureDir(destPath);
      await processDirectory({
        srcDir: srcPath,
        destDir: destPath,
        targetName: tempName,
        textExts,
        popUpName,
      });
    } else if (entry.isFile()) {
      // 处理文件
      const parentDir = srcPath.split('/')[srcPath.split('/').length - 2];
      const isTsx = srcPath.endsWith('.tsx');
      // 是不是首页文件
      const isPageIndex =
        [E_TemplateType.PAGE, E_TemplateType.DRAWER_PAGE].includes(parentDir as E_TemplateType) &&
        isTsx;
      await processFile(srcPath, destPath, tempName, textExts, isPageIndex, popUpName);
    }
  }
}

async function processFile(
  srcFile: string,
  destFile: string,
  targetName: string,
  textExts: Set<string>,
  isPartial: boolean = false,
  popUpname?: string,
): Promise<void> {
  const ext = path.extname(srcFile).toLowerCase();
  if (textExts.has(ext)) {
    // 处理文本文件：替换内容后写入
    const content = await fse.readFile(srcFile, 'utf8');
    let newContent = '';
    if (isPartial) {
      const tempPopUpName = popUpname ?? targetName;
      newContent = content
        .replace(/CreateOrEditTargetName/g, `CreateOrEdit${tempPopUpName}`)
        .replace(
          /createOrEditTargetName/g,
          `createOrEdit${tempPopUpName!.charAt(0).toLowerCase() + tempPopUpName!.slice(1)}`,
        )
        .replace(/TargetName/g, targetName)
        .replace(/targetName/g, targetName.charAt(0).toLowerCase() + targetName.slice(1));
    } else {
      newContent = content
        .replace(/TargetName/g, targetName)
        .replace(/targetName/g, targetName.charAt(0).toLowerCase() + targetName.slice(1));
    }

    await fse.writeFile(destFile, newContent);
  } else {
    // 处理二进制文件：直接复制
    await fse.copy(srcFile, destFile);
  }
}
