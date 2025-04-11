import fs from 'fs-extra';
import path from 'path';
/**
 * 递归替换目录/文件名及文件内容中的 PageName
 * @param srcPath 源目录路径
 * @param name 要替换的名称
 */
export async function replacePageName(srcPath: string, name: string) {
  // 先处理子项，再处理当前目录名称
  const entries = await fs.readdir(srcPath);

  // 并行处理所有子项
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(srcPath, entry);
      const stats = await fs.stat(entryPath);

      if (stats.isDirectory()) {
        // 递归处理子目录内容
        await replacePageName(entryPath, name);
      } else {
        // 处理文件
        await processFile(entryPath, name);
      }
    }),
  );

  // 处理当前目录名称
  await renameDir(srcPath, name);
}

/**
 * 处理单个文件
 */
async function processFile(filePath: string, name: string) {
  // 替换文件名
  const newFilePath = await renameFile(filePath, name);

  // 仅处理文本文件（根据扩展名过滤）
  const textExtensions = new Set([
    '.js',
    '.ts',
    '.tsx',
    '.less',
    '.jsx',
    '.json',
    '.html',
    '.css',
    '.md',
  ]);
  const ext = path.extname(newFilePath);

  if (textExtensions.has(ext)) {
    // 读取并替换内容
    const content = await fs.readFile(newFilePath, 'utf8');
    const newContent = content.replace(/PageName/g, name);

    // 写入新内容
    await fs.writeFile(newFilePath, newContent);
  }
}

/**
 * 重命名文件
 */
async function renameFile(filePath: string, name: string) {
  const dir = path.dirname(filePath);
  const oldName = path.basename(filePath);
  const newName = oldName.replace(/PageName/g, name);

  if (oldName !== newName) {
    const newPath = path.join(dir, newName);
    await fs.move(filePath, newPath);
    return newPath;
  }
  return filePath;
}

/**
 * 重命名目录
 */
async function renameDir(dirPath: string, name: string) {
  const parentDir = path.dirname(dirPath);
  const oldName = path.basename(dirPath);
  const newName = oldName.replace(/PageName/g, name);

  if (oldName !== newName) {
    const newPath = path.join(parentDir, newName);
    await fs.move(dirPath, newPath);
  }
}
