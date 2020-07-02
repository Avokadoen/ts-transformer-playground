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
    isIdentifier,
    isTypeReferenceNode,
    isFunctionTypeNode,
    isArrayLiteralExpression,
    createArrayLiteral,
    createLiteral
} from 'typescript';
import {join, resolve, dirname} from 'path';


export default function transformer(program: Program): TransformerFactory<SourceFile> {
    return (context: TransformationContext) => (file: SourceFile) => {
        const visitor = (node: Node): Node => {
            const result = injectReturn(node, program);
            if (!result) {
                return node;
            }

            if (!isArrayLiteralExpression(result)) {
                visitEachChild(node, visitor, context);
            }

            return result;
        };
      
        return visitNode(file, visitor);
    };
}

function injectReturn(node: Node, program: Program): Node | undefined {
    if (isFnParameterTypesImportExpression(node)) {
        return;
    }
    
    const typeChecker = program.getTypeChecker();
    if (!isFnParameterTypesCallExpression(node, typeChecker)) {
        return node;
    }

    const cCount = node.getChildCount();
    if (cCount <= 1) {
        return node;
    }

    const args = node?.typeArguments;
    if (!args) {
        return createArrayLiteral([]);
    }

    const fnType = args[0];
    if (!isFunctionTypeNode(fnType)) {
        return createArrayLiteral([]);
    }

    return createArrayLiteral(fnType.parameters.map(p => {
        const t = p.type;
        if (t && isTypeReferenceNode(t)) {
            if (isIdentifier(t.typeName)) {
                console.log(t.typeName.getFullText());
                return createLiteral(t.typeName.getFullText());
            }
        }
        return createLiteral('');
    }));
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
