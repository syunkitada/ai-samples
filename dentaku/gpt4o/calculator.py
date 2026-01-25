class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


if __name__ == "__main__":
    calc = Calculator()
    print("Addition: 2 + 3 =", calc.add(2, 3))
    print("Subtraction: 5 - 2 =", calc.subtract(5, 2))
    print("Multiplication: 4 * 3 =", calc.multiply(4, 3))
    print("Division: 10 / 2 =", calc.divide(10, 2))
