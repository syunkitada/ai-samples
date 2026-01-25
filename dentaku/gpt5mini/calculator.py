"""Safe calculator CLI and REPL.

Usage:
  - Evaluate expression: `python3 calculator.py -e "2*(3+4)"`
  - Start interactive REPL: `python3 calculator.py` or `python3 calculator.py --repl`

Supports +, -, *, /, %, //, ** and unary +/-. Uses ast to safely evaluate.
"""

from __future__ import annotations

import ast
import operator
import argparse
import sys


class _Evaluator(ast.NodeVisitor):
    def __init__(self):
        self._ops = {
            ast.Add: operator.add,
            ast.Sub: operator.sub,
            ast.Mult: operator.mul,
            ast.Div: operator.truediv,
            ast.Mod: operator.mod,
            ast.FloorDiv: operator.floordiv,
            ast.Pow: operator.pow,
        }

    def visit(self, node):
        method = "visit_" + node.__class__.__name__
        visitor = getattr(self, method, None)
        if visitor is None:
            raise ValueError(f"Unsupported expression: {node.__class__.__name__}")
        return visitor(node)

    def visit_Expression(self, node: ast.Expression):
        return self.visit(node.body)

    def visit_BinOp(self, node: ast.BinOp):
        left = self.visit(node.left)
        right = self.visit(node.right)
        op_type = type(node.op)
        if op_type not in self._ops:
            raise ValueError(f"Unsupported operator: {op_type.__name__}")
        return self._ops[op_type](left, right)

    def visit_UnaryOp(self, node: ast.UnaryOp):
        operand = self.visit(node.operand)
        if isinstance(node.op, ast.UAdd):
            return +operand
        if isinstance(node.op, ast.USub):
            return -operand
        raise ValueError(f"Unsupported unary operator: {node.op.__class__.__name__}")

    def visit_Constant(self, node: ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError("Only int/float constants are allowed")

    # For Python <3.8 compatibility
    def visit_Num(self, node: ast.Num):
        return node.n


def evaluate(expr: str) -> float:
    """Safely evaluate a numeric expression and return result.

    Raises ValueError for unsupported constructs or malformed expressions.
    """
    try:
        tree = ast.parse(expr, mode="eval")
    except SyntaxError as e:
        raise ValueError(f"Syntax error in expression: {e}")
    evaluator = _Evaluator()
    return evaluator.visit(tree)


def repl():
    print("gpt5mini 電卓 REPL — 終了: exit, quit, Ctrl-D")
    while True:
        try:
            line = input(">>> ").strip()
        except EOFError:
            print()
            break
        if not line:
            continue
        if line.lower() in ("exit", "quit"):
            break
        try:
            result = evaluate(line)
            print(result)
        except Exception as e:
            print(f"エラー: {e}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Safe calculator")
    parser.add_argument("-e", "--expr", help="Evaluate expression and exit")
    parser.add_argument("--repl", action="store_true", help="Start REPL")
    args = parser.parse_args(argv)

    if args.expr:
        try:
            res = evaluate(args.expr)
            print(res)
            return 0
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            return 2

    if args.repl or not args.expr:
        repl()
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
