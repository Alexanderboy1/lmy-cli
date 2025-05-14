import * as t from '@babel/types'; //主要用于生成AST节点
import { parse } from '@babel/parser'; // 解析代码为AST
import generator from '@babel/generator'; //将AST转换为代码
import traverse from '@babel/traverse'; //遍历AST
import fs from 'fs-extra'; // 文件操作
import prettier from 'prettier';
import { getRelativePath, toLowerCaseFirstLetter } from './utils';
/**
 * 参数：目标文件地址、生成文件地址、生成文件名称
 * 结果：在目标文件中插入代码
 */

export interface IInsertCodeOptions {
  targetFilePath: string; // 目标文件地址
  targetFileName: string; // 目标文件名称
  insertFilePath: string; // 插入文件地址
  insertFileName: string; // 插入文件名称
}

export async function insertCode({
  targetFilePath,
  targetFileName,
  insertFilePath,
  insertFileName,
}: IInsertCodeOptions) {
  console.log('开始处理代码');

  try {
    // 读取目标文件
    const targetFileContent = await fs.readFile(targetFilePath, 'utf-8');

    // // 转换为AST
    const ast = parse(targetFileContent, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
      errorRecovery: true,
    });

    // 遍历AST
    traverse(ast, {
      Program(path) {
        // 导入组件和ref类型
        const insertCode = `import ${insertFileName},{${insertFileName}Ref} from '${getRelativePath(targetFilePath.endsWith('index.tsx') ? targetFilePath.slice(0, -9) : targetFilePath, insertFilePath)}';`;

        const insertAst = parse(insertCode, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
          errorRecovery: true,
        });

        // 查找import语句
        const importDeclaration = path.node.body.find((node) => t.isImportDeclaration(node));

        if (importDeclaration) {
          try {
            path.unshiftContainer('body', insertAst.program.body);
          } catch (error) {}
        } else {
          // 如果没有import语句，则直接在文件开头插入代码
          path.unshiftContainer('body', insertAst.program.body);
        }
      },
      ImportDeclaration(path) {
        if (path.node.source.value === 'react') {
          const hasUseRef = path.node.specifiers.some(
            (spec) =>
              t.isImportSpecifier(spec) && (spec.imported as t.Identifier).name === 'useRef',
          );

          if (!hasUseRef) {
            path.unshiftContainer(
              'specifiers',
              t.importSpecifier(t.identifier('useRef'), t.identifier('useRef')),
            );
          }

          // path.stop(); // 找到 react 导入后停止
        }
      },
      // 处理组件引入
      VariableDeclaration(path: any) {
        // 在组件引入ref时，添加ref类型
        const decl = path.node.declarations[0];

        if (decl?.id?.name === targetFileName && t.isArrowFunctionExpression(decl?.init)) {
          const arrowFnBody = decl.init.body;
          if (t.isBlockStatement(arrowFnBody)) {
            // 创建范型
            const typeParams = t.tsTypeParameterInstantiation([
              t.tsTypeReference(t.identifier(`${insertFileName}Ref`)),
            ]);
            // 创建赋值表达式
            const useRefCall = t.callExpression(t.identifier('useRef'), [t.nullLiteral()]);
            // 将范型应用于useRef
            (useRefCall as any).typeArguments = typeParams;

            // 创建变量声明
            const variableDeclaration = t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier(toLowerCaseFirstLetter(`${insertFileName}Ref`)),
                useRefCall,
              ),
            ]);
            // 在函数体内插入变量声明
            arrowFnBody.body.unshift(variableDeclaration);
            // 找到函数里renturn 后面的<></>节点
            const returnStatement = arrowFnBody.body.find(
              (stmt) => t.isReturnStatement(stmt) && t.isJSXFragment(stmt.argument),
            ) as t.ReturnStatement;

            if (returnStatement && t.isJSXFragment(returnStatement.argument)) {
              const jsxFragment = returnStatement.argument;
              // 创建<TargetName ref={insertFileNameRef} />到最后面
              const newJSXElement = t.jsxElement(
                t.jsxOpeningElement(
                  t.jsxIdentifier(insertFileName),
                  [
                    t.jsxAttribute(
                      t.jsxIdentifier('ref'),
                      t.jsxExpressionContainer(
                        t.identifier(toLowerCaseFirstLetter(`${insertFileName}Ref`)),
                      ),
                    ),
                  ],
                  true,
                ),
                null,
                [],
              );
              jsxFragment.children.push(newJSXElement);
            }
          }
        }
      },
    });

    // // 生成代码
    const code = generator(ast).code;

    // 写入目标文件
    const formatCode = await prettier.format(code, {
      parser: 'babel-ts',
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'always',
      endOfLine: 'lf',
    });

    await fs.writeFile(targetFilePath, formatCode, 'utf-8');
    console.log(`代码插入成功：${insertFileName} -> ${targetFileName}`);
  } catch (error) {}
}
