import path from 'path';
import fse from 'fs-extra';

interface ScaffoldOptions {
  templateDir: string;
  outputDir: string;
  pageName: string;
  textExtensions?: string[];
}

const DEFAULT_TEXT_EXTS = ['.js', '.ts', '.tsx', '.less', '.json', '.html', '.css', '.scss'];

export async function scaffold(options: ScaffoldOptions): Promise<void> {
  const { templateDir, outputDir, pageName } = options;
  const textExts = new Set(options.textExtensions || DEFAULT_TEXT_EXTS);

  // 清空并创建目标目录
  await fse.remove(outputDir);
  await fse.ensureDir(outputDir);

  // 开始处理根目录
  await processDirectory(templateDir, outputDir, pageName, textExts);
  console.log('✅ 脚手架生成成功');
}

async function processDirectory(
  srcDir: string,
  destDir: string,
  pageName: string,
  textExts: Set<string>,
): Promise<void> {
  // 读取源目录下所有条目
  const entries = await fse.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const processedName = entry.name.replace(/PageName/g, pageName);
    const destPath = path.join(destDir, processedName);

    if (entry.isDirectory()) {
      // 处理目录：创建目录后递归处理
      await fse.ensureDir(destPath);
      await processDirectory(srcPath, destPath, pageName, textExts);
    } else if (entry.isFile()) {
      // 处理文件
      await processFile(srcPath, destPath, pageName, textExts);
    }
  }
}

async function processFile(
  srcFile: string,
  destFile: string,
  pageName: string,
  textExts: Set<string>,
): Promise<void> {
  const ext = path.extname(srcFile).toLowerCase();

  if (textExts.has(ext)) {
    // 处理文本文件：替换内容后写入
    const content = await fse.readFile(srcFile, 'utf8');
    const newContent = content.replace(/PageName/g, pageName);
    await fse.writeFile(destFile, newContent);
  } else {
    // 处理二进制文件：直接复制
    await fse.copy(srcFile, destFile);
  }
}
