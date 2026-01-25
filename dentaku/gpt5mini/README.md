# gpt5mini 電卓

軽量で安全な Python 電卓。

使い方:

- 単発評価:

```
python3 calculator.py -e "2*(3+4)"
```

- 対話型 REPL:

```
python3 calculator.py
```

サポート演算: `+ - * / % // **` と 単項 +/-. AST を使い安全に評価します。
