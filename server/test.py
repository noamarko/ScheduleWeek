import requests

BASE = "http://127.0.0.1:5000/"

# response = requests.put(BASE+"/add", {})
# print(response.text)

# response = requests.put(BASE+"/", {"name":"Marko",
#                                          "swimmingForm":{"form1":"butterfly", "form2":"freestyle","form3":""},
#                                          "days":{"day1":"thursday 10-20", "day2":"tuesday 10-15", "day3":""},
#                                          "private":"false"})
# print(response.json())
response = requests.post(BASE+"add", {'name': 'noam', 
                                    'swimmingForm': {'form1': 'freestyle', 'form2': '', 'form3': ''},
                                    'days': {'day1': 'sunday 10-11', 'day2': '', 'day3': ''},
                                    'private': False})
print(response.text)
response = requests.get(BASE+"get")
print(response.json())
