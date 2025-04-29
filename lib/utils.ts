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

export { renameTargetDir, createOutputDirName };
