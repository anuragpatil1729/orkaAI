# gui.py - Tkinter Graphical User Interface for Calculator Project
import tkinter as tk
from tkinter import messagebox
from calc import add, subtract, multiply, divide

class CalculatorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Python Calculator GUI")
        self.root.geometry("320x420")
        self.result_var = tk.StringVar(value="0")
        
        # Display screen
        entry = tk.Entry(root, textvariable=self.result_var, font=("Inter", 20), justify="right", bd=10)
        entry.pack(fill="both", expand=True, padding=10)
        
        # Keypad buttons
        buttons = [
            ['7', '8', '9', '/'],
            ['4', '5', '6', '*'],
            ['1', '2', '3', '-'],
            ['C', '0', '=', '+']
        ]
        for row in buttons:
            frame = tk.Frame(root)
            frame.pack(fill="both", expand=True)
            for char in row:
                btn = tk.Button(frame, text=char, font=("Inter", 16), command=lambda c=char: self.on_click(c))
                btn.pack(side="left", fill="both", expand=True)

    def on_click(self, char):
        if char == "C":
            self.result_var.set("0")
        elif char == "=":
            try:
                self.result_var.set(str(eval(self.result_var.get())))
            except Exception:
                self.result_var.set("Error")
        else:
            curr = self.result_var.get()
            if curr == "0":
                self.result_var.set(char)
            else:
                self.result_var.set(curr + char)

if __name__ == "__main__":
    root = tk.Tk()
    app = CalculatorGUI(root)
    root.mainloop()
