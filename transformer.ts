
import ts, { CallExpression, isIdentifier, TypeNode, isFunctionTypeNode, isTypeReferenceNode, createLiteral } from 'typescript';
import path from 'path';
import { type } from 'os';

// SOURCE: https://github.com/kimamula/ts-transformer-keys

export default function transformer(program: ts.Program): ts.TransformerFactory<ts.SourceFile> {
    return (context: ts.TransformationContext) => (file: ts.SourceFile) => visitNodeAndChildren(file, program, context);
}

function visitNodeAndChildren(node: ts.SourceFile, program: ts.Program, context: ts.TransformationContext): ts.SourceFile;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node | undefined;
function visitNodeAndChildren(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node | undefined {
    return ts.visitEachChild(visitNode(node, program), childNode => visitNodeAndChildren(childNode, program, context), context);
}

function visitNode(node: ts.SourceFile, program: ts.Program): ts.SourceFile;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined;
function visitNode(node: ts.Node, program: ts.Program): ts.Node | undefined {
    const typeChecker = program.getTypeChecker();
    if (isFnParameterTypesImportExpression(node)) {
        return;
    }
    if (!isFnParameterTypesCallExpression(node, typeChecker)) {
        return node;
    }

    if (!node.typeArguments) {
        return ts.createArrayLiteral([]);
    }

    const typeArray = extractIdentifierTypeString(node.typeArguments[0]);
    return ts.createArrayLiteral(typeArray.map(paraType => ts.createLiteral(paraType)));
}

function extractIdentifierTypeString(node: TypeNode): string[] {
    const typeArray: string[] = [];
    if (!isFunctionTypeNode(node)) {
        return typeArray;
    }
    for (const p of node.parameters) {
        const t = p.type;
        if (t && isTypeReferenceNode(t)) {
            if (isIdentifier(t.typeName)) {
                typeArray.push(t.typeName.escapedText as string)
            }
        }
    }

    return typeArray;
}

const indexJs = path.join(__dirname, 'index.js');
function isFnParameterTypesImportExpression(node: ts.Node): node is ts.ImportDeclaration {
    if (!ts.isImportDeclaration(node)) {
        return false;
    }
    const module = (node.moduleSpecifier as ts.StringLiteral).text;
    try {
        return indexJs === (
        module.startsWith('.')
            ? require.resolve(path.resolve(path.dirname(node.getSourceFile().fileName), module))
            : require.resolve(module)
        );
    } catch(e) {
        return false;
    }
}

const indexTs = path.join(__dirname, 'index.d.ts');
function isFnParameterTypesCallExpression(node: ts.Node, typeChecker: ts.TypeChecker): node is ts.CallExpression {
    if (!ts.isCallExpression(node)) {
        return false;
    }
    const signature = typeChecker.getResolvedSignature(node);
    if (typeof signature === 'undefined') {
        return false;
    }
    const { declaration } = signature;
    return !!declaration
        && !ts.isJSDocSignature(declaration)
        && require.resolve(declaration.getSourceFile().fileName) === indexTs
        && declaration.name?.getText() === 'fnParameterTypes';
}