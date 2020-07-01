"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var path_1 = require("path");
function transformer(program) {
    return function (context) { return function (file) {
        var visitor = function (node) {
            var found = retrieveSyntaxList(peekAtNode(node, program));
            if (found) {
                // console.log(node.kind, `\t# ts.SyntaxKind.${SyntaxKind[node.kind]}, pos: ${node}`);
                found.getChildren().forEach(function (c) { return console.log("" + typescript_1.SyntaxKind[(c).kind]); });
                return found;
            }
            return typescript_1.visitEachChild(node, visitor, context);
        };
        return typescript_1.visitNode(file, visitor);
    }; };
}
exports.default = transformer;
function retrieveSyntaxList(node) {
    if (!node) {
        return;
    }
    var children = node.getChildren();
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        if (child.kind === typescript_1.SyntaxKind.SyntaxList) {
            return child;
        }
    }
    return;
}
function peekAtNode(node, program) {
    if (isFnParameterTypesImportExpression(node)) {
        return;
    }
    var typeChecker = program.getTypeChecker();
    if (!isFnParameterTypesCallExpression(node, typeChecker)) {
        return;
    }
    var cCount = node.getChildCount();
    if (cCount <= 1) {
        return;
    }
    return node;
}
var indexJs = path_1.join(__dirname, 'index.js');
function isFnParameterTypesImportExpression(node) {
    if (!typescript_1.isImportDeclaration(node)) {
        return false;
    }
    var module = node.moduleSpecifier.text;
    try {
        return indexJs === (module.startsWith('.')
            ? require.resolve(path_1.resolve(path_1.dirname(node.getSourceFile().fileName), module))
            : require.resolve(module));
    }
    catch (e) {
        return false;
    }
}
var indexTs = path_1.join(__dirname, 'index.d.ts');
function isFnParameterTypesCallExpression(node, typeChecker) {
    var _a;
    if (!typescript_1.isCallExpression(node)) {
        return false;
    }
    var signature = typeChecker.getResolvedSignature(node);
    if (typeof signature === 'undefined') {
        return false;
    }
    var declaration = signature.declaration;
    return !!declaration
        && !typescript_1.isJSDocSignature(declaration)
        && require.resolve(declaration.getSourceFile().fileName) === indexTs
        && ((_a = declaration.name) === null || _a === void 0 ? void 0 : _a.getText()) === 'fnParameterTypes';
}
