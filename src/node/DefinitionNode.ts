import { EvaluationContext } from "../context/EvaluationContext";
import { NodeTracer } from "../logger";
import { EvaluationUnit } from "../types";
import { FunctionValue, JavascriptValue } from "../value";
import { ExpressionNode, StatementNode } from "./BaseNode";
import { IdentifierNode } from "./ExpressionNode";

export abstract class DefinitionNode extends ExpressionNode {
    abstract identifier: IdentifierNode;
}

export class JavascriptDefinitionNode extends DefinitionNode {
    identifier: IdentifierNode;
    parameters: IdentifierNode[];
    func: (...args: any) => any;

    constructor(
        identifier: IdentifierNode,
        parameters: IdentifierNode[],
        func: (...args: any) => any
    ) {
        super();
        this.identifier = identifier;
        this.parameters = parameters;
        this.func = func;
    }

    // @EvaluateTracer()
    *evaluate(ctx: EvaluationContext): EvaluationUnit {
        const value = new JavascriptValue(this.identifier.identifier, this);
        ctx.executionContext.environment.environmentRecord[
            this.identifier.identifier
        ] = value;
        return value;
    }
}

export class FunctionDefinitionNode extends DefinitionNode {
    identifier: IdentifierNode;
    parameters: IdentifierNode[];
    body: StatementNode;

    constructor(
        identifier: IdentifierNode,
        parameters: IdentifierNode[],
        body: StatementNode
    ) {
        super();
        this.identifier = identifier;
        this.parameters = parameters;
        this.body = body;
    }

    *evaluate(ctx: EvaluationContext): EvaluationUnit {
        const value = new FunctionValue(this.identifier.identifier, this);
        ctx.executionContext.environment.environmentRecord[
            this.identifier.identifier
        ] = value;
        return value;
    }
}

export class ProgramNode extends FunctionDefinitionNode {
    constructor(nodes: StatementNode) {
        super(new IdentifierNode("global"), [], nodes);
    }
}