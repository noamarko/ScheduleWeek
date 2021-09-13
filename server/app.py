from flask import Flask, json, jsonify, request
from flask_cors import CORS
import pytest
import pymongo

myclient = pymongo.MongoClient("mongodb://localhost:27017/")

mydb = myclient["mydatabase"]
studentCol = mydb["Student"]
daysCol = mydb["Instructor"]
dateCol = mydb["Date"]


app = Flask(__name__)
CORS(app)

studentFinalList = []

def checkName(name):
    extractedName = name.split(' ')
    if not extractedName[0].isalpha() and (extractedName[1] == "" or extractedName[1].isalpha()):
        return False
    return True

def checkForms(swimmingForm):
    for form in swimmingForm:
        if not swimmingForm[form].isalpha() and swimmingForm[form] != "":
            return False
    return True

def checkDays(days):
    for day in days:
        if days[day] != "":
            check = days[day].split(" ")
            if not check[0].isalpha():
                return False
            anotherCheck = check[1].split("-")
            if not (anotherCheck[0].isnumeric() and anotherCheck[1].isnumeric()
                    and (len(anotherCheck[0]) == 2 and len(anotherCheck[1]) == 2)):
                return False
    return True

def test_data(data):

    nameFlag = checkName(data['name'])
    formFlag = checkForms(data['swimmingForm'])
    daysFlag = checkDays(data['days'])
    
    if not isinstance(data['private'], bool):
        return False
    if len(studentFinalList) == 30:
        return False

    if nameFlag and formFlag and daysFlag:
        return True
    else:
        return False


@app.route('/')
def index():
    return jsonify(studentFinalList)


@app.route('/get', methods=['GET'])
def get_list():
    return jsonify(studentFinalList), 200


@app.route('/add', methods=['POST'])
def add():
    data = request.get_json()
    flag = test_data(data)
    if flag:
        studentFinalList.append(data)
            # studentCol.insert_one(data['name'])
            # daysCol.insert_many(data['days'])

    else:
        return "Error: Invalid Input", 404

    return jsonify(studentFinalList), 201
        


@app.route('/delete', methods=['DELETE'])
def delete():
    studentFinalList.clear()
    return jsonify(studentFinalList), 200





if __name__ == "__main__":
    app.run(debug=True)

####### TEST FUNCTIONS #######


