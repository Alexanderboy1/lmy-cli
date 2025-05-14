import path from 'path';
export type RenameTargetDir = {
  baseUrl: string;
  targetDirName: string;
  userDirUrl?: string; //用户输入的目录
};
const renameTargetDir = ({ baseUrl, targetDirName, userDirUrl }: RenameTargetDir) => {
  return path.resolve(
    process.cwd(),
    userDirUrl ? `${userDirUrl}/${targetDirName}` : `${baseUrl}/${targetDirName}`,
  );
};

/**
 *
 * @param name 目录名称
 * @param prefixPath 存放的指定文件夹
 * @returns 构造的相对应当前工作目录的文件path
 */
const createOutputDirName = (name: string, prefixPath?: string) => {
  return path.resolve(process.cwd(), prefixPath ? `${prefixPath}/${name}` : name);
};

/**
 * 获取文件相对于目标文件夹的路径
 * @param {string} fromDir 目标文件夹路径
 * @param {string} toFile  要定位的文件路径
 * @returns {string} 相对路径
 */
function getRelativePath(fromDir: string, toFile: string) {
  // 1. 统一转换为绝对路径
  const absoluteFrom = path.resolve(fromDir);
  const absoluteTo = path.resolve(toFile);
  console.log(fromDir, toFile);

  // 2. 计算相对路径
  let relativePath = path.relative(absoluteFrom, absoluteTo);

  // 3. 处理路径格式（Windows反斜杠转正斜杠）
  if (path.sep === '\\') {
    relativePath = relativePath.replace(/\\/g, '/');
  }
  // 4. 确保路径以 './' 开头
  if (
    !relativePath.startsWith('./') &&
    !relativePath.startsWith('/') &&
    !relativePath.startsWith('../')
  ) {
    relativePath = `./${relativePath}`;
  }

  return relativePath;
}

// 将字符串的首写字母小写
function toLowerCaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// 将字符串的首写字母大写
function toUpperCaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export {
  renameTargetDir,
  createOutputDirName,
  getRelativePath,
  toLowerCaseFirstLetter,
  toUpperCaseFirstLetter,
};
