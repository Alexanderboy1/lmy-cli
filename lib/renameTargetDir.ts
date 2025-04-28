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

export default renameTargetDir;
