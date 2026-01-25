class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero.")
        return a / b


if __name__ == "__main__":
    calc = Calculator()
    print("電卓を起動しました。")
    while True:
        try:
            expr = input("式を入力してください (例: 2 + 3)、終了は 'exit': ")
            if expr.strip().lower() == "exit":
                print("終了します。")
                break
            parts = expr.split()
            if len(parts) != 3:
                print("式は 'a 演算子 b' の形式で入力してください。")
                continue
            a, op, b = parts
            a = float(a)
            b = float(b)
            if op == "+":
                result = calc.add(a, b)
            elif op == "-":
                result = calc.subtract(a, b)
            elif op == "*":
                result = calc.multiply(a, b)
            elif op == "/":
                result = calc.divide(a, b)
            else:
                print("対応していない演算子です。使える演算子: + - * /")
                continue
            print(f"結果: {result}")
        except Exception as e:
            print(f"エラー: {e}")
