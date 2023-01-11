import io
from flask import Flask, render_template, request, send_file
import torch
import os 


app = Flask(__name__)

@app.route('/saveAudio', methods=["POST"])
def saveAudio():
    return "hy"

@app.route('/getAudio',methods=["GET"])
def getAudio():
    return "hy"

if __name__ == '__main__':
    app.run(debug=True, host='::', port=5000)