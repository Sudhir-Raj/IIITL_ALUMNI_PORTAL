import numpy as np 
from output import fun
import pandas as pd
from flask import Flask, request, jsonify 
from flask_cors import CORS, cross_origin 
import pickle 
import json 

app = Flask(__name__)   
CORS(app, support_credentials=True) 
model = pickle.load(open('model_knn.pkl', 'rb'))


@app.route('/predict',methods=['POST']) 
@cross_origin(supports_credentials=True) 
def predict(): 
    data = request.get_json(force=True) 
    response = jsonify(fun()) 
    return response          

if __name__ == '_main_': 
    app.run(port=5000, debug=True)