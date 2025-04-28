import path from 'path';
const createOutputDirName = (name: string, prefixPath?: string) => {
  return path.resolve(process.cwd(), prefixPath ? `${prefixPath}/${name}` : name);
};
export default createOutputDirName;
