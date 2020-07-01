import { 
    CallExpression, 
    TypeChecker,
    StringLiteral,
    Node, 
    ImportDeclaration, 
    TransformerFactory,
    SourceFile, 
    TransformationContext,
    Program,
    visitEachChild,
    visitNode,
    isImportDeclaration,
    isCallExpression,
    isJSDocSignature,
    SyntaxKind
} from 'typescript';
import {join, resolve, dirname} from 'path';


export default function transformer(program: Program): TransformerFactory<SourceFile> {
    return (context: TransformationContext) => (file: SourceFile) => {
        const visitor = (node: Node): Node => {
            const found = retrieveSyntaxList(peekAtNode(node, program));
            if (found) {
                // console.log(node.kind, `\t# ts.SyntaxKind.${SyntaxKind[node.kind]}, pos: ${node}`);
                found.getChildren().forEach((c: Node) => console.log(`${SyntaxKind[(c).kind]}`));
                
                return found;
            }

            return visitEachChild(node, visitor, context);
        };
      
        return visitNode(file, visitor);
    };
}

function retrieveSyntaxList(node?: Node): Node | undefined {
    if (!node) {
        return;
    }

    const children = node.getChildren();

    for (const child of children) {
        if (child.kind === SyntaxKind.SyntaxList) {
            return child;
        }
    }

    return;
}

function peekAtNode(node: Node, program: Program): Node | undefined {
    if (isFnParameterTypesImportExpression(node)) {
        return;
    }
    
    const typeChecker = program.getTypeChecker();
    if (!isFnParameterTypesCallExpression(node, typeChecker)) {
        return;
    }

    const cCount = node.getChildCount();
    if (cCount <= 1) {
        return;
    }

    return node;
} 

const indexJs = join(__dirname, 'index.js');
function isFnParameterTypesImportExpression(node: Node): node is ImportDeclaration {
    if (!isImportDeclaration(node)) {
        return false;
    }
    const module = (node.moduleSpecifier as StringLiteral).text;
    try {
        return indexJs === (
        module.startsWith('.')
            ? require.resolve(resolve(dirname(node.getSourceFile().fileName), module))
            : require.resolve(module)
        );
    } catch(e) {
        return false;
    }
}

const indexTs = join(__dirname, 'index.d.ts');
function isFnParameterTypesCallExpression(node: Node, typeChecker: TypeChecker): node is CallExpression {
    if (!isCallExpression(node)) {
        return false;
    }
    const signature = typeChecker.getResolvedSignature(node);
    if (typeof signature === 'undefined') {
        return false;
    }
    const { declaration } = signature;
    return !!declaration 
        && !isJSDocSignature(declaration)
        && require.resolve(declaration.getSourceFile().fileName) === indexTs
        && declaration.name?.getText() === 'fnParameterTypes';
}
